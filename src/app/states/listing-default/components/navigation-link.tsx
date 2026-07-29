type NavigationLinkStyles = Record<string, string>;
export type NavigationLinkData = {
  href: string;
  label: string;
};
/** A storefront navigation link. */
export default function NavigationLink({ d, cids, styles }: { d: NavigationLinkData; cids: string[]; styles: NavigationLinkStyles }) {
  return (
    <li data-cid={cids[0]} className={styles.className}>
      <a data-cid={cids[1]} className={styles.className2} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
