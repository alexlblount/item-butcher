import { useState } from 'react';
import { useAppSelector } from '@src/state/hooks';
import { selectUniqueSortedItemTypes } from './vaultSlice';
import ItemTile from './ItemTile';
import styles from './VaultPage.module.css';
import ItemCard from './ItemCard';

export default function VaultPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // The `state` arg is correctly typed as `RootState` already
  const items = useAppSelector((state) => state.vault.items);
  const itemHeaders = useAppSelector(selectUniqueSortedItemTypes);

  if (!items.length) {
    return (
      <div id="vault-page" className={styles.vault}>
        <div className={styles.noItems}>
          <h2>No items found</h2>
          <p>Click any where on the page and paste an image of the item.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="vault-page" className={styles.vault}>
      <div className={styles.itemList}>
        {itemHeaders.map((itemHeader) => (
          <div key={itemHeader}>
            <h3>{itemHeader}</h3>
            <div className={styles.container}>
              {items
                .filter((item) => item.itemType === itemHeader)
                .map((item) => (
                  <ItemTile key={item.id} item={item} selectItem={setSelectedItem} />
                ))}
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className={styles.selectedItem}>
          <ItemCard item={selectedItem} />
        </div>
      )}
    </div>
  );
}
