type ProductCardStyles = Record<string, string>;
export type ProductCardData = {
  kind?: string;
  alt: string;
  height?: string;
  imgSrc: string;
  width?: string;
  kind2?: string;
  kind3?: string;
  href: string;
  title: string;
  text: string;
};
/** A commerce product card with image, title, price, and destination. */
export default function ProductCard({ d, cids, styles }: { d: ProductCardData; cids: string[]; styles: ProductCardStyles }) {
  return (
    <div data-cid={cids[0]} className={styles.className}>
      <div data-cid={cids[1]} className={styles.className2}>
        <div data-cid={cids[2]} className={styles.className3}>
          <img data-cid={cids[3]} className={styles.className4} data-component={d.kind} alt={d.alt} height={d.height} src={d.imgSrc} width={d.width} />
        </div>
        <div data-cid={cids[4]} className={styles.className5}>
          <h3 data-cid={cids[5]} className={styles.className6} data-component={d.kind2}>
            <a data-cid={cids[6]} className={styles.className7} data-component={d.kind3} href={d.href}>
              {d.title}
            </a>
          </h3>
          <div data-cid={cids[7]} className={styles.className8}>
            <span data-cid={cids[8]} className={styles.className9}>
              {d.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
