import { selectUniqueSortedItemTypes } from '@features/vault/vaultSlice';
import { useAppSelector } from '@src/state/hooks';
import ItemTile from '@features/vault/ItemTile';
import styles from './VaultPage.module.css';

export default function VaultPage() {
  // The `state` arg is correctly typed as `RootState` already
  const items = useAppSelector((state) => state.vault.items);
  const itemHeaders = useAppSelector(selectUniqueSortedItemTypes);
  return (
    <div id="vault-page" className={styles.vault}>
      {itemHeaders.map((itemHeader) => (
        <div key={itemHeader}>
          <h2>{itemHeader}</h2>
          <div className={styles.container}>
            {items
              .filter((item) => item.itemType === itemHeader)
              .map((item) => (
                <ItemTile key={item.id} item={item} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
