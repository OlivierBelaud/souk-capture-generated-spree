type CommerceBenefitCardStyles = Record<string, string>;
export type CommerceBenefitCardData = {
  title: string;
  description: string;
};
/** A commerce service or reassurance benefit. */
export default function CommerceBenefitCard({ d, cids, styles }: { d: CommerceBenefitCardData; cids: string[]; styles: CommerceBenefitCardStyles }) {
  return (
    <li data-cid={cids[0]} className={styles.className}>
      <h3 data-cid={cids[1]} className={styles.className2} data-component="heading">
        {d.title}
      </h3>
      <p data-cid={cids[2]} className={styles.className3}>
        {d.description}
      </p>
    </li>
  );
}
