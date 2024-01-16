import { useMemo } from 'react';
import { useAppSelector } from '@src/state/hooks';
import type { Item } from '@features/imageParsing/transformText';
import { calculateAspectRankings, getAspectStrength } from './rankStrength';
import { selectItemsBySelectedAspect } from './aspectSlice';
import CompareCard from './CompareCard';
import styles from './AspectComparison.module.css';

function sortItemsByAspectStrength(items: Item[]): Item[] {
  return items.sort((a, b) => {
    const strengthA = getAspectStrength(a);
    const strengthB = getAspectStrength(b);

    // Skip non-numeric values by treating them as null
    if (!strengthA || strengthA.some((val) => typeof val !== 'number')) return 1;
    if (!strengthB || strengthB.some((val) => typeof val !== 'number')) return -1;

    for (let i = 0; i < strengthA.length; i++) {
      // Compare each numeric value
      if (typeof strengthA[i] === 'number' && typeof strengthB[i] === 'number') {
        if (strengthA[i] !== strengthB[i]) {
          // return strengthA[i] - strengthB[i]; // Ascending order
          return strengthB[i] - strengthA[i]; // Descending order
        }
      }
    }

    // Secondary sorting by power in descending order
    return b.basePower - a.basePower;
  });
}

export default function AspectComparison() {
  const selectedItems = useAppSelector(selectItemsBySelectedAspect);
  const sortedItems = useMemo(() => sortItemsByAspectStrength(selectedItems), [selectedItems]);
  const rankings = calculateAspectRankings(selectedItems);

  return (
    <div className={styles.container}>
      {sortedItems.map((item) => (
        <CompareCard key={item.id} item={item} rankings={rankings} />
      ))}
    </div>
  );
}
