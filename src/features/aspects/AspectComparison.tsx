import { useAppSelector } from '@src/state/hooks';
import { calculateAspectRankings } from './rankStrength';
import { selectItemsBySelectedAspect } from './aspectSlice';
import CompareCard from './CompareCard';
import styles from './AspectComparison.module.css';

export default function AspectComparison() {
  const selectedItems = useAppSelector(selectItemsBySelectedAspect);

  const rankings = calculateAspectRankings(selectedItems);

  console.log({ rankings });

  return (
    <div className={styles.container}>
      {selectedItems.map((item) => (
        <CompareCard key={item.id} item={item} rankings={rankings} />
      ))}
    </div>
  );
}
