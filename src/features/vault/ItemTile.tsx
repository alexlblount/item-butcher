import { useCallback } from 'react';
import type { Item } from '@features/imageParsing/transformText';
import { getTypeName, getPowerDisplay } from './itemHelpers';
import styles from './ItemTile.module.css';
import Thumbnail from '@features/layout/Thumbnail';

interface ItemTileProps {
  item: Item;
  selectItem?: (item: Item) => void;
}

export default function ItemTile({ item, selectItem }: ItemTileProps) {
  const typeName = getTypeName(item);
  const powerDisplay = getPowerDisplay(item);

  const handleClick = useCallback(() => {
    if (selectItem) selectItem(item);
  }, [item, selectItem]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.tile} onClick={handleClick}>
      <div className={styles.summary}>
        <Thumbnail item={item} />
        <div className={styles.title}>{item.name}</div>
        <div className={styles.subtitle}>{typeName}</div>
        <div className={styles.power}>{powerDisplay}</div>
      </div>
    </div>
  );
}
