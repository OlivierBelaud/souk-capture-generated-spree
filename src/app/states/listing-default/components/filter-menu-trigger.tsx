type FilterMenuTriggerStyles = Record<string, string>;
export type FilterMenuTriggerData = {
  id: string;
  label: string;
};
/** A collection filter menu trigger. */
export default function FilterMenuTrigger({ d, cids, styles }: { d: FilterMenuTriggerData; cids: string[]; styles: FilterMenuTriggerStyles }) {
  return (
    <button data-cid={cids[0]} className={styles.className} data-component="button" aria-expanded="false" aria-haspopup="menu" id={d.id} type="button">
      <span data-cid={cids[1]} className={styles.className2}>
        {d.label}
      </span>
      <svg data-cid={cids[2]} className={styles.className3} data-component="icon" aria-hidden="true" fill="none" height="24" stroke="currentColor" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}
