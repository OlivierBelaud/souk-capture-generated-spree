type CategoryLinkStyles = Record<string, string>;
export type CategoryLinkData = {
  href: string;
  label: string;
};
/** A product category link. */
export default function CategoryLink({ d, cids, styles }: { d: CategoryLinkData; cids: string[]; styles: CategoryLinkStyles }) {
  return (
    <a data-cid={cids[0]} className={styles.className} data-component="link" href={d.href}>
      {d.label}
    </a>
  );
}
