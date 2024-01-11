import type { Item } from '@features/imageParsing/transformText';
import styles from './ItemCard.module.css';
import { getPowerDisplay, getTypeName } from './itemHelpers';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const typeName = getTypeName(item);
  const powerDisplay = getPowerDisplay(item);
  const height = (item.iconHeight || 0) + 8;
  return (
    <div
      className={[styles.card, styles[item.rarity]].join(' ')}
      style={{ minHeight: `${height}px` }}
    >
      <img
        className={styles.icon}
        src={item.iconDataUrl}
        alt={`${item.name} icon`}
      />
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
