import { useMemo } from 'react';
import type { Item } from '@features/imageParsing/transformText';
import styles from './ItemCard.module.css';
import { getPowerDisplay, getTypeName } from './itemHelpers';
import { getImageData } from '@features/imageParsing/thumbnailer';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const typeName = getTypeName(item);
  const powerDisplay = getPowerDisplay(item);
  const height = (item.iconHeight || 0) + 8;

  const dataUrl = useMemo(() => {
    if (item.imageStorageKey) return getImageData(item.imageStorageKey);
  }, [item.imageStorageKey]);

  return (
    <div className={[styles.card, styles[item.rarity]].join(' ')} style={{ minHeight: `${height}px` }}>
      {dataUrl && <img className={styles.icon} src={dataUrl} alt={`${item.name} icon`} />}
      <div className={styles.title}>{item.name}</div>
      <div className={styles.subtitle}>{typeName}</div>
      <div className={styles.power}>{powerDisplay}</div>
      {Object.entries(item.affixes).map(([affixName, affixValue]) => {
        return (
          <div className={styles.affix} key={affixName}>
            {affixName}: {affixValue}
          </div>
        );
      })}
    </div>
  );
}
