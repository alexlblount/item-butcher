import { getImageData } from '@features/imageParsing/thumbnailer';
import { Item } from '@features/imageParsing/transformText';
import { useMemo } from 'react';
import styles from './Thumbnail.module.css';

interface ThumbnailProps {
  item: Item;
}

export default function Thumbnail({ item }: ThumbnailProps) {
  const dataUrl = useMemo(() => {
    if (item.imageStorageKey) return getImageData(item.imageStorageKey);
  }, [item.imageStorageKey]);
  if (!dataUrl) return null;

  return (
    <div className={styles.thumbnail}>
      <img className={styles.image} src={dataUrl} alt={`${item.name} icon`} />
    </div>
  );
}
