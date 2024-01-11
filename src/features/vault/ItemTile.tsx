import type { Item } from '@features/imageParsing/transformText';
import styles from './ItemTile.module.css';
import { getTypeName, getPowerDisplay } from './itemHelpers';

interface ItemTileProps {
  item: Item;
}

export default function ItemTile({ item }: ItemTileProps) {
  const typeName = getTypeName(item);
  const powerDisplay = getPowerDisplay(item);
  return (
    <div className={styles.tile}>
      <div className={styles.summary}>
        <div className={styles.title}>{item.name}</div>
        <div className={styles.subtitle}>{typeName}</div>
        <div className={styles.power}>{powerDisplay}</div>
      </div>
      <div className={styles.icon}>
        <img src={item.iconDataUrl} alt="icon" />
      </div>
    </div>
  );
}
