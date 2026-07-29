type ProductGalleryThumbnailStyles = Record<string, string>;
export type ProductGalleryThumbnailData = {
  alt: string;
  imgSrc: string;
};
/** A product gallery thumbnail control. */
export default function ProductGalleryThumbnail({ d, cids, styles }: { d: ProductGalleryThumbnailData; cids: string[]; styles: ProductGalleryThumbnailStyles }) {
  return (
    <button data-cid={cids[0]} className={styles.className} data-component="button" type="button">
      <img data-cid={cids[1]} className={styles.className2} data-component="image" alt={d.alt} height="76" src={d.imgSrc} width="76" />
    </button>
  );
}
