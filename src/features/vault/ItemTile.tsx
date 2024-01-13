import { useMemo } from 'react';
import { getImageData } from '@features/imageParsing/thumbnailer';
import type { Item } from '@features/imageParsing/transformText';
import { getTypeName, getPowerDisplay } from './itemHelpers';
import styles from './ItemTile.module.css';

interface ItemTileProps {
  item: Item;
}

export default function ItemTile({ item }: ItemTileProps) {
  const typeName = getTypeName(item);
  const powerDisplay = getPowerDisplay(item);

  const dataUrl = useMemo(() => {
    if (item.imageStorageKey) return getImageData(item.imageStorageKey);
  }, [item.imageStorageKey]);

  return (
    <div className={styles.tile}>
      <div className={styles.summary}>
        <div className={styles.title}>{item.name}</div>
        <div className={styles.subtitle}>{typeName}</div>
        <div className={styles.power}>{powerDisplay}</div>
      </div>
      {dataUrl && (
        <div className={styles.icon}>
          <img src={dataUrl} alt="icon" />
        </div>
      )}
    </div>
  );
}
