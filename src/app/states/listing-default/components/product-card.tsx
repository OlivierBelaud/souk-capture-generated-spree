type ProductCardStyles = Record<string, string>;
export type ProductCardData = {
  alt: string;
  imgSrc: string;
  href: string;
  title: string;
  text: string;
};
/** A commerce product card with image, title, price, and destination. */
export default function ProductCard({ d, cids, styles }: { d: ProductCardData; cids: string[]; styles: ProductCardStyles }) {
  return (
    <div data-cid={cids[0]} className={styles.className}>
      <div data-cid={cids[1]} className={styles.className2}>
        <img data-cid={cids[2]} className={styles.className3} data-component="image" alt={d.alt} height="304" src={d.imgSrc} width="304" />
      </div>
      <div data-cid={cids[3]} className={styles.className4}>
        <h3 data-cid={cids[4]} className={styles.className5} data-component="heading">
          <a data-cid={cids[5]} className={styles.className6} data-component="link" href={d.href}>
            {d.title}
          </a>
        </h3>
        <div data-cid={cids[6]} className={styles.className7}>
          <span data-cid={cids[7]} className={styles.className8}>
            {d.text}
          </span>
        </div>
      </div>
    </div>
  );
}
