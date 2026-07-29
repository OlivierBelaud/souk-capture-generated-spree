type MegaMenuCategoryStyles = Record<string, string>;
export type MegaMenuCategoryData = {
  href: string;
  label: string;
  href2: string;
  label2: string;
  href3: string;
  label3: string;
  href4: string;
  label4: string;
};
/** A category and its nested mega-menu links. */
export default function MegaMenuCategory({ d, cids, styles }: { d: MegaMenuCategoryData; cids: string[]; styles: MegaMenuCategoryStyles }) {
  return (
    <li data-cid={cids[0]} className={styles.className}>
      <a data-cid={cids[1]} className={styles.className2} data-component="link" href={d.href}>
        {d.label}
      </a>
      <ul data-cid={cids[2]} className={styles.className3}>
        <li data-cid={cids[3]} className={styles.className4}>
          <a data-cid={cids[4]} className={styles.className5} data-component="link" href={d.href2}>
            {d.label2}
          </a>
        </li>
        <li data-cid={cids[5]} className={styles.className6}>
          <a data-cid={cids[6]} className={styles.className7} data-component="link" href={d.href3}>
            {d.label3}
          </a>
        </li>
        <li data-cid={cids[7]} className={styles.className8}>
          <a data-cid={cids[8]} className={styles.className9} data-component="link" href={d.href4}>
            {d.label4}
          </a>
        </li>
      </ul>
    </li>
  );
}
