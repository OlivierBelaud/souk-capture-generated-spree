import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { unzipSync } from "fflate";
import { chromium } from "playwright";

const apiOrigin = process.env.SOUK_V2_LIVE_API_ORIGIN || "https://api.wearesouk.com";
const appOrigin = process.env.SOUK_V2_LIVE_APP_ORIGIN ||
  "https://souk-capture-frontend-git-v2-de-291bc9-olivier-belauds-projects.vercel.app";
const sourceUrl = new URL(process.env.SOUK_V2_LIVE_SOURCE_URL || "https://fancypalas.com/").toString();
const archivePath = process.env.SOUK_V2_LIVE_EXTENSION_ARCHIVE;
const artifactDirectory = process.env.SOUK_V2_LIVE_ARTIFACT_DIR || "";
const payGenerateDeploy = process.env.SOUK_V2_LIVE_PAY_GENERATE_DEPLOY === "true";
const expectedExtensionId = process.env.SOUK_V2_LIVE_EXTENSION_ID ||
  "amhhbhockakjhgakjdbadfdmedefohkb";

if (!archivePath) throw new Error("SOUK_V2_LIVE_EXTENSION_ARCHIVE is required.");

const email = `capture-v2-qa+${Date.now()}@souk.test`;
const password = `Qa!${randomBytes(18).toString("base64url")}`;
const temporaryRoot = mkdtempSync(join(tmpdir(), "souk-capture-v2-live-"));
const extensionPath = join(temporaryRoot, "extension");
const evidenceDirectory = artifactDirectory || join(temporaryRoot, "evidence");
mkdirSync(evidenceDirectory, { recursive: true });

let context;
try {
  event("qualification-revision", { revision: "theme-geometry-extension-v10" });
  const registration = await jsonRequest(`${apiOrigin}/api/capture-register`, {
    method: "POST",
    body: JSON.stringify({ name: "Souk Capture V2 QA", email, password }),
  });
  assert.ok(registration.token, "Registration must return an access token.");
  const token = registration.token;

  const created = await jsonRequest(`${apiOrigin}/api/capture-v2/projects`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: `FancyPalas V2 ${new Date().toISOString().slice(0, 10)}`,
      sourceUrl,
      clientRequestId: randomUUID(),
    }),
  });
  const projectId = created.project?.id;
  assert.ok(projectId, "The V2 project must be created.");
  event("project-created", { projectId, sourceUrl });

  extractExtension(archivePath, extensionPath);
  context = await chromium.launchPersistentContext(join(temporaryRoot, "profile"), {
    channel: "chromium",
    headless: false,
    viewport: { width: 1440, height: 1000 },
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      "--disable-dev-shm-usage",
    ],
  });
  const worker = context.serviceWorkers()[0] ??
    await context.waitForEvent("serviceworker", { timeout: 20_000 });
  const extensionId = new URL(worker.url()).hostname;
  assert.equal(extensionId, expectedExtensionId, "The deployed V2 archive must keep its stable extension ID.");
  event("extension-loaded", { extensionId });

  const landing = await context.newPage();
  const landingResponse = await landing.goto(appOrigin, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  assert.ok(landingResponse && landingResponse.status() < 400, "The V2 landing page must be public.");
  await landing.getByRole("heading", { name: /Set your storefront free/i }).waitFor();
  await captureEvidence(landing, join(evidenceDirectory, "01-v2-landing-full.png"));

  await landing.goto(
    `${appOrigin}/studio-v2?project=${encodeURIComponent(projectId)}`,
    { waitUntil: "domcontentloaded", timeout: 60_000 },
  );
  await landing.evaluate(({ accessToken, refreshToken }) => {
    localStorage.setItem("souk.studio.access-token.v1", accessToken);
    if (refreshToken) localStorage.setItem("souk.studio.refresh-token.v1", refreshToken);
  }, { accessToken: token, refreshToken: registration.refreshToken || "" });
  await landing.reload({ waitUntil: "networkidle", timeout: 60_000 });
  await landing.getByRole("heading", { name: created.project.name }).waitFor({ timeout: 30_000 });
  await captureEvidence(landing, join(evidenceDirectory, "02-v2-studio-before-capture.png"));

  const ping = await extensionMessage(landing, extensionId, { type: "SOUK_V2_PING" });
  assert.equal(ping.installed, true, "The deployed studio must be allowed to contact the V2 extension.");
  const connected = await extensionMessage(landing, extensionId, {
    type: "SOUK_V2_CONNECT",
    projectId,
    sourceUrl,
    apiBaseUrl: apiOrigin,
    appBaseUrl: appOrigin,
    token,
    refreshToken: registration.refreshToken || "",
  });
  assert.equal(connected.connected, true);

  const started = await jsonRequest(
    `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/runs`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify({ maxRoutes: 120, maxDepth: 4, maxDurationMs: 15 * 60_000 }),
    },
  );
  assert.ok(started.run?.id, "The backend must create a V2 discovery run.");
  const discovery = await extensionMessage(landing, extensionId, {
    type: "SOUK_V2_START_DISCOVERY",
    projectId,
    sourceUrl,
    runId: started.run.id,
  });
  assert.equal(discovery.busy, true);
  event("discovery-started", { projectId, runId: started.run.id });

  const discovered = await waitForDiscovery(projectId, token);
  event("discovery-result", {
    projectId,
    status: discovered.status,
    captureCount: discovered.captureCount,
    catalog: discovered.catalog || null,
    observations: discovered.run?.observations || [],
    warnings: discovered.run?.warnings || [],
  });
  assert.ok(discovered.catalog, "FancyPalas must expose a local Shopify catalog.");
  assert.ok(discovered.catalog.productCount > 0, "The local catalog must contain products.");
  assert.ok(discovered.catalog.collectionCount > 0, "The local catalog must contain collections.");
  assert.ok(discovered.captureCount >= 3, "Discovery must persist several representative public scenes.");
  const observedKinds = new Set((discovered.run?.observations || []).map((entry) => entry.kind));
  for (const required of ["home", "listing", "product"]) {
    assert.ok(observedKinds.has(required), `Discovery must observe a ${required} scene.`);
  }
  assert.ok(
    ["review_ready", "attention_required"].includes(discovered.status),
    `Discovery must stop in a reviewable state, got ${discovered.status}.`,
  );
  event("discovery-qualified", {
    projectId,
    status: discovered.status,
    captureCount: discovered.captureCount,
    productCount: discovered.catalog.productCount,
    collectionCount: discovered.catalog.collectionCount,
    observedKinds: [...observedKinds],
    warnings: discovered.run?.warnings || [],
  });

  const sourcePage = context.pages()
    .find((page) => page.url().startsWith(new URL(sourceUrl).origin)) || await context.newPage();
  await sourcePage.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await settlePage(sourcePage);
  await captureEvidence(sourcePage, join(evidenceDirectory, "03-fancypalas-source-home.png"));
  const catalogSamples = await readCatalogSamples(
    sourcePage,
    discovered.run?.observations || [],
  );

  await landing.bringToFront();
  await landing.reload({ waitUntil: "networkidle", timeout: 60_000 });
  await captureEvidence(landing, join(evidenceDirectory, "04-v2-studio-after-capture.png"));

  let deployment = null;
  let generation = null;
  if (payGenerateDeploy) {
    const checkout = await jsonRequest(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/payment/checkout`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          origin: appOrigin,
        },
        body: "{}",
      },
    );
    assert.match(checkout.sessionId || "", /^cs_test_/);
    assert.ok(checkout.url, "Stripe test Checkout must return a URL.");
    const checkoutPage = await context.newPage();
    const returned = await completeStripeTestCheckout(
      checkoutPage,
      checkout.url,
      checkout.sessionId,
      email,
      projectId,
    );
    await captureEvidence(checkoutPage, join(evidenceDirectory, "05-stripe-return.png"));
    const confirmation = await waitForPaymentConfirmation(
      checkoutPage,
      projectId,
      token,
      returned.sessionId,
    );
    await checkoutPage.close();
    assert.equal(confirmation.payment?.paid, true, "Stripe confirmation must unlock generation.");
    event("payment-confirmed", { projectId, sessionId: returned.sessionId });

    await jsonRequest(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/generate`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: "{}",
        timeoutMs: 120_000,
      },
    );
    generation = await waitForGeneration(projectId, token);
    writeFileSync(
      join(evidenceDirectory, "generation.json"),
      `${JSON.stringify(generation, null, 2)}\n`,
    );
    if (["succeeded", "review"].includes(generation.status)) {
      const bundle = await fetch(
        `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/bundle?format=zip`,
        {
          headers: { authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(5 * 60_000),
        },
      );
      assert.equal(bundle.status, 200, "The paid V2 bundle must be downloadable.");
      const bundleBytes = Buffer.from(await bundle.arrayBuffer());
      writeFileSync(join(evidenceDirectory, "storefront-v2.zip"), bundleBytes);
      emitBundleDiagnostics(bundleBytes);
    }
    assert.equal(
      generation.status,
      "succeeded",
      `V2 generation must pass its runtime and commerce gates: ${generation.error || generation.status}`,
    );
    event("generation-qualified", {
      projectId,
      status: generation.status,
      phase: generation.phase,
      progress: generation.progress,
    });

    await jsonRequest(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/deployment/vercel`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: "{}",
        timeoutMs: 120_000,
      },
    );
    deployment = await waitForDeployment(projectId, token);
    assert.equal(deployment.status, "ready");
    assert.match(deployment.url || "", /^https:\/\/[a-z0-9.-]+\.vercel\.app$/i);
    await qualifyDeployedStorefront(context, deployment.url, catalogSamples, evidenceDirectory);
    event("deployment-qualified", { projectId, url: deployment.url });
  }

  const report = {
    passed: true,
    projectId,
    appOrigin,
    sourceUrl,
    extensionId,
    discovery: {
      status: discovered.status,
      captureCount: discovered.captureCount,
      catalog: discovered.catalog,
      observations: discovered.run?.observations || [],
      warnings: discovered.run?.warnings || [],
    },
    generation,
    deployment,
  };
  writeFileSync(join(evidenceDirectory, "qualification.json"), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`SOUK_V2_QUALIFICATION=${JSON.stringify(report)}\n`);
} finally {
  await context?.close().catch(() => undefined);
  if (!artifactDirectory) rmSync(temporaryRoot, { recursive: true, force: true });
}

async function captureEvidence(page, path) {
  try {
    await page.screenshot({ path, fullPage: true });
  } catch (error) {
    event("screenshot-retry", {
      path,
      error: error instanceof Error ? error.message : String(error),
    });
    await delay(750);
    await page.screenshot({ path, fullPage: false }).catch((retryError) => {
      event("screenshot-skipped", {
        path,
        error: retryError instanceof Error ? retryError.message : String(retryError),
      });
    });
  }
}

function extractExtension(archive, destinationRoot) {
  for (const [relativePath, contents] of Object.entries(unzipSync(readFileSync(archive)))) {
    const destination = join(destinationRoot, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, contents);
  }
}

function emitBundleDiagnostics(bundleBytes) {
  const files = unzipSync(bundleBytes);
  const names = Object.keys(files)
    .filter((name) => name.includes(".souk/validation/"))
    .sort();
  event("bundle-validation-files", { names });
  const fidelityName = names.find((name) => name.endsWith("/fidelity.json"));
  if (fidelityName) {
    const fidelity = Buffer.from(files[fidelityName]).toString("utf8");
    writeFileSync(join(evidenceDirectory, "fidelity.json"), fidelity);
    process.stdout.write(`SOUK_V2_FIDELITY=${fidelity.replace(/\s+/g, " ")}\n`);
  }
  let emittedBytes = 0;
  const visualEvidenceNames = names
    .filter((entry) => /\.(?:jpe?g|png)$/i.test(entry))
    .sort((left, right) => {
      const leftIsJpeg = /\.jpe?g$/i.test(left);
      const rightIsJpeg = /\.jpe?g$/i.test(right);
      return leftIsJpeg === rightIsJpeg ? left.localeCompare(right) : leftIsJpeg ? -1 : 1;
    });
  for (const name of visualEvidenceNames) {
    const contents = Buffer.from(files[name]);
    if (emittedBytes + contents.length > 2_000_000) break;
    emittedBytes += contents.length;
    process.stdout.write(`SOUK_V2_VALIDATION_IMAGE=${JSON.stringify({
      name,
      mime: /\.jpe?g$/i.test(name) ? "image/jpeg" : "image/png",
      image: contents.toString("base64"),
    })}\n`);
  }
}

function extensionMessage(page, extensionId, message) {
  return page.evaluate(({ targetId, payload }) => new Promise((resolve, reject) => {
    const runtime = globalThis.chrome?.runtime;
    if (!runtime?.sendMessage) {
      reject(new Error("chrome.runtime.sendMessage is unavailable on the deployed V2 origin."));
      return;
    }
    runtime.sendMessage(targetId, payload, (response) => {
      if (runtime.lastError) reject(new Error(runtime.lastError.message));
      else if (!response?.ok) reject(new Error(response?.error || "Extension rejected the message."));
      else resolve(response);
    });
  }), { targetId: extensionId, payload: message });
}

async function waitForDiscovery(projectId, token) {
  const deadline = Date.now() + 25 * 60_000;
  let last;
  while (Date.now() < deadline) {
    last = (await jsonRequest(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}`,
      { headers: { authorization: `Bearer ${token}` } },
    )).project;
    event("discovery-progress", {
      status: last.status,
      captureCount: last.captureCount,
      productCount: last.catalog?.productCount || 0,
      currentUrl: last.run?.currentUrl || null,
    });
    if (["review_ready", "attention_required", "ready", "review", "failed"].includes(last.status)) {
      return last;
    }
    await delay(5_000);
  }
  throw new Error(`V2 discovery timed out in ${last?.status || "unknown"} state.`);
}

async function waitForGeneration(projectId, token) {
  const deadline = Date.now() + 20 * 60_000;
  let generation;
  let lastLogTail = "";
  while (Date.now() < deadline) {
    generation = (await jsonRequest(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/generation`,
      { headers: { authorization: `Bearer ${token}` }, timeoutMs: 120_000 },
    )).generation;
    event("generation-progress", {
      status: generation.status,
      phase: generation.phase,
      progress: generation.progress,
      ...(generation.error ? { error: generation.error } : {}),
      ...(["succeeded", "review", "failed", "cancelled"].includes(generation.status) && generation.log
        ? { logTail: String(generation.log).slice(-8_000) }
        : {}),
    });
    const runningLogTail = String(generation.log || "").slice(-1_600);
    if (runningLogTail && runningLogTail !== lastLogTail) {
      lastLogTail = runningLogTail;
      event("generation-log", { logTail: runningLogTail });
    }
    if (["succeeded", "review", "failed", "cancelled"].includes(generation.status)) return generation;
    await delay(5_000);
  }
  throw new Error(`V2 generation timed out in ${generation?.status || "unknown"} state.`);
}

async function waitForDeployment(projectId, token) {
  const deadline = Date.now() + 15 * 60_000;
  let deployment;
  while (Date.now() < deadline) {
    deployment = (await jsonRequest(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/deployment/vercel`,
      { headers: { authorization: `Bearer ${token}` }, timeoutMs: 120_000 },
    )).deployment;
    event("deployment-progress", { status: deployment.status, url: deployment.url || null });
    if (["ready", "failed"].includes(deployment.status)) return deployment;
    await delay(5_000);
  }
  throw new Error(`V2 deployment timed out in ${deployment?.status || "unknown"} state.`);
}

async function qualifyDeployedStorefront(browserContext, deploymentUrl, samples, evidenceRoot) {
  const page = await browserContext.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const routes = [
    ["/", "home"],
    [`/products/${encodeURIComponent(samples.productHandle)}`, "product"],
    [`/collections/${encodeURIComponent(samples.collectionHandle)}`, "collection"],
    [`/search?q=${encodeURIComponent(samples.query)}`, "search"],
    ["/cart", "cart"],
  ];
  for (const [path, label] of routes) {
    const response = await page.goto(`${deploymentUrl}${path}`, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    assert.ok(response && response.status() < 400, `Generated ${label} route must return HTTP 2xx/3xx.`);
    assert.ok((await page.locator("body").innerText()).trim().length > 40, `Generated ${label} route must render content.`);
    await captureEvidence(page, join(evidenceRoot, `generated-${label}.png`));
  }

  await page.goto(`${deploymentUrl}/products/${encodeURIComponent(samples.productHandle)}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  const addToCart = page.getByRole("button", { name: /add to (?:bag|cart)/i }).first();
  await addToCart.waitFor({ state: "visible", timeout: 20_000 });
  await addToCart.click();
  const cartSurface = page.locator('[role="dialog"], [data-cart-drawer], a[href="/cart"]').filter({
    hasText: /cart|bag|checkout/i,
  }).first();
  await cartSurface.waitFor({ state: "visible", timeout: 20_000 });
  await page.goto(`${deploymentUrl}/cart`, { waitUntil: "networkidle", timeout: 60_000 });
  assert.match(await page.locator("body").innerText(), new RegExp(escapeRegExp(samples.productTitle), "i"));
  if (samples.capturedProductHandle) {
    await page.goto(
      `${deploymentUrl}/products/${encodeURIComponent(samples.capturedProductHandle)}`,
      { waitUntil: "networkidle", timeout: 60_000 },
    );
    const dismiss = page.locator('button,[role="button"],a').filter({
      hasText: /no thanks|not now|dismiss/i,
    }).first();
    if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
    const capturedAddToCart = page.locator('[data-souk-actions~="add-to-cart"]').first();
    await capturedAddToCart.waitFor({ state: "visible", timeout: 20_000 });
    await capturedAddToCart.click();
    await page.getByRole("dialog", { name: /shopping cart/i }).waitFor({
      state: "visible",
      timeout: 20_000,
    });
    await captureEvidence(page, join(evidenceRoot, "generated-captured-product-cart.png"));
    await page.goto(`${deploymentUrl}/cart`, { waitUntil: "networkidle", timeout: 60_000 });
    assert.match(
      await page.locator("body").innerText(),
      new RegExp(escapeRegExp(samples.capturedProductTitle), "i"),
    );
  }
  assert.deepEqual(errors, [], `Generated storefront emitted browser errors: ${errors.join(" | ")}`);
  await page.close();
}

async function readCatalogSamples(page, observations = []) {
  const canonicalOrigin = new URL(page.url()).origin;
  const productsResponse = await page.context().request.get(
    `${canonicalOrigin}/products.json?limit=20`,
    { timeout: 30_000 },
  );
  const collectionsResponse = await page.context().request.get(
    `${canonicalOrigin}/collections.json?limit=20`,
    { timeout: 30_000 },
  );
  const products = productsResponse.ok()
    ? (await productsResponse.json().catch(() => ({}))).products || []
    : [];
  const collections = collectionsResponse.ok()
    ? (await collectionsResponse.json().catch(() => ({}))).collections || []
    : [];
  const productObservation = observations.find((entry) =>
    entry.kind === "product" && entry.state === "default" && entry.url);
  const collectionObservation = observations.find((entry) =>
    entry.kind === "listing" && entry.state === "default" && /\/collections\//.test(entry.url || ""));
  const productHandle = products[0]?.handle || pathHandle(productObservation?.url, "products");
  const productTitle = products[0]?.title || productObservation?.title;
  const capturedProductHandle = pathHandle(productObservation?.url, "products");
  const capturedProductTitle = products.find((product) =>
    product.handle === capturedProductHandle)?.title || productObservation?.title || "";
  const collectionHandle = collections[0]?.handle || pathHandle(collectionObservation?.url, "collections");
  assert.ok(productHandle && productTitle, "FancyPalas must expose a sample product.");
  assert.ok(collectionHandle, "FancyPalas must expose a sample collection.");
  return {
    productHandle,
    productTitle,
    capturedProductHandle,
    capturedProductTitle,
    collectionHandle,
    query: String(productTitle).split(/\s+/)[0],
  };
}

function pathHandle(input, segment) {
  try {
    const parts = new URL(input).pathname.split("/").filter(Boolean);
    const index = parts.indexOf(segment);
    return index >= 0 ? parts[index + 1] || "" : "";
  } catch {
    return "";
  }
}

async function settlePage(page) {
  await page.waitForFunction(() => document.readyState !== "loading" && Boolean(document.body), null, {
    timeout: 30_000,
  });
  await page.waitForTimeout(2_000);
}

async function jsonRequest(url, init = {}) {
  const { timeoutMs = 60_000, ...requestInit } = init;
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (requestInit.body) headers.set("content-type", "application/json");
  const response = await fetch(url, {
    ...requestInit,
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || body.message || `HTTP ${response.status} for ${url}`);
  }
  return body;
}

async function completeStripeTestCheckout(
  page,
  checkoutUrl,
  checkoutSessionId,
  customerEmail,
  projectId,
) {
  await page.goto(checkoutUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  const emailInput = await visibleInput(page, ['input[type="email"]', 'input[name="email"]'], false);
  if (emailInput && !(await emailInput.inputValue())) await emailInput.fill(customerEmail);
  const cardNumber = await visibleInput(page, ['input[name="cardNumber"]', "#cardNumber"]);
  const cardExpiry = await visibleInput(page, ['input[name="cardExpiry"]', "#cardExpiry"]);
  const cardCvc = await visibleInput(page, ['input[name="cardCvc"]', "#cardCvc"]);
  await typeStripeField(cardNumber, "4242 4242 4242 4242");
  await typeStripeField(cardExpiry, "12 / 34");
  await typeStripeField(cardCvc, "123");
  const name = await visibleInput(page, ['input[name="billingName"]', 'input[autocomplete="name"]'], false);
  if (name) await name.fill("Souk Capture V2 QA");
  const postal = await visibleInput(page, [
    'input[name="billingPostalCode"]',
    'input[autocomplete="postal-code"]',
  ], false);
  if (postal) await postal.fill("10001");
  await fillRequiredStripeFields(page, customerEmail);
  event("stripe-fields-filled", {
    cardNumber: Boolean(await cardNumber.inputValue()),
    cardExpiry: Boolean(await cardExpiry.inputValue()),
    cardCvc: Boolean(await cardCvc.inputValue()),
    postal: postal ? Boolean(await postal.inputValue()) : null,
  });
  const submit = page.locator('button[type="submit"]:visible').last();
  if (await submit.count()) await submit.click();
  else await page.getByRole("button", { name: /pay|payer/i }).last().click();
  await Promise.race([
    page.waitForURL((url) =>
      url.pathname === "/studio-v2" &&
      /^cs_test_/.test(url.searchParams.get("session_id") || ""), {
      timeout: 30_000,
      waitUntil: "commit",
    }).catch(() => null),
    page.waitForTimeout(12_000),
  ]);
  const returned = new URL(page.url());
  const sessionId = returned.searchParams.get("session_id") || checkoutSessionId || "";
  assert.match(sessionId, /^cs_test_/);
  if (returned.pathname === "/studio-v2") {
    assert.equal(returned.searchParams.get("project"), projectId);
  } else {
    event("stripe-submit-pending", {
      url: returned.origin + returned.pathname,
      invalidFields: await invalidStripeFields(page),
      errors: await page.locator(
        '[role="alert"], [data-testid*="error" i], [class*="error" i]',
      ).allInnerTexts().catch(() => []),
    });
  }
  return { sessionId };
}

async function waitForPaymentConfirmation(page, projectId, token, sessionId) {
  const deadline = Date.now() + 90_000;
  let lastBody = {};
  while (Date.now() < deadline) {
    const response = await fetch(
      `${apiOrigin}/api/capture-v2/projects/${encodeURIComponent(projectId)}/payment/confirm`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
        signal: AbortSignal.timeout(30_000),
      },
    );
    lastBody = await response.json().catch(() => ({}));
    if (response.ok && lastBody.payment?.paid) return lastBody;
    if (response.status !== 402) {
      throw new Error(lastBody.error || lastBody.message || `Stripe confirmation HTTP ${response.status}.`);
    }
    await page.waitForTimeout(2_000);
  }
  const errors = await page.locator(
    '[role="alert"], [data-testid*="error" i], [class*="error" i]',
  ).allInnerTexts().catch(() => []);
  throw new Error(
    `Stripe Checkout stayed unpaid: ${lastBody.error || lastBody.message || "no confirmation"}; ${errors.join(" | ")}`,
  );
}

async function visibleInput(page, selectors, required = true) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      for (const selector of selectors) {
        const locator = frame.locator(selector).first();
        if (await locator.isVisible().catch(() => false)) return locator;
      }
    }
    await page.waitForTimeout(100);
  }
  if (required) throw new Error(`Stripe field unavailable: ${selectors.join(", ")}`);
  return null;
}

async function typeStripeField(locator, value) {
  await locator.click();
  await locator.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await locator.pressSequentially(value, { delay: 25 });
}

async function fillRequiredStripeFields(page, customerEmail) {
  for (const frame of page.frames()) {
    const controls = frame.locator("input:visible, select:visible, textarea:visible");
    for (let index = 0; index < await controls.count(); index += 1) {
      const control = controls.nth(index);
      const details = await control.evaluate((element) => ({
        tagName: element.tagName.toLowerCase(),
        type: element.getAttribute("type") || "",
        descriptor: [
          element.getAttribute("name"),
          element.id,
          element.getAttribute("autocomplete"),
          element.getAttribute("aria-label"),
          element.getAttribute("placeholder"),
        ].filter(Boolean).join(" "),
        required: element.required || element.getAttribute("aria-required") === "true",
        value: element.value || "",
      })).catch(() => null);
      if (!details?.required || details.value) continue;
      const descriptor = details.descriptor.toLowerCase();
      if (details.type === "checkbox") {
        await control.check();
      } else if (details.tagName === "select") {
        const options = await control.locator("option").evaluateAll((nodes) =>
          nodes.map((node) => ({ label: node.textContent?.trim() || "", value: node.value }))
            .filter((option) => option.value));
        const preferred = options.find((option) => /united states|portugal/i.test(option.label)) || options[0];
        if (preferred) await control.selectOption(preferred.value);
      } else if (/e-?mail/.test(descriptor)) {
        await control.fill(customerEmail);
      } else if (/postal|zip/.test(descriptor)) {
        await control.fill("10001");
      } else if (/phone|tel/.test(descriptor)) {
        await control.fill("2125550100");
      } else if (/address.*(?:line.?1)?|line.?1/.test(descriptor)) {
        await control.fill("123 Broadway");
      } else if (/city|locality|town/.test(descriptor)) {
        await control.fill("New York");
      } else if (/state|province|region/.test(descriptor)) {
        await control.fill("New York");
      } else {
        await control.fill("Souk Capture V2 QA");
      }
    }
  }
}

async function invalidStripeFields(page) {
  const fields = [];
  for (const frame of page.frames()) {
    fields.push(...await frame.locator("input:invalid, select:invalid, textarea:invalid")
      .evaluateAll((nodes) => nodes.map((element) => ({
        type: element.getAttribute("type") || element.tagName.toLowerCase(),
        name: element.getAttribute("name") || "",
        id: element.id || "",
        autocomplete: element.getAttribute("autocomplete") || "",
        ariaLabel: element.getAttribute("aria-label") || "",
      }))).catch(() => []));
  }
  return fields;
}

function event(phase, payload = {}) {
  process.stdout.write(`${JSON.stringify({ phase, ...payload })}\n`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
