type ProductSpecificationStyles = Record<string, string>;
export type ProductSpecificationData = {
  text: string;
  text2: string;
};
/** A product specification name and value. */
export default function ProductSpecification({ d, cids, styles }: { d: ProductSpecificationData; cids: string[]; styles: ProductSpecificationStyles }) {
  return (
    <div data-cid={cids[0]} className={styles.className}>
      <dt data-cid={cids[1]} className={styles.className2}>
        {d.text}
      </dt>
      <dd data-cid={cids[2]} className={styles.className3}>
        {d.text2}
      </dd>
    </div>
  );
}
