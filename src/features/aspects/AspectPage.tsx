import styles from './AspectPage.module.css';
import AspectDropdown from './AspectDropdown';
import AspectComparison from './AspectComparison';

export default function AspectPage() {
  return (
    <div className={styles.page}>
      <AspectDropdown />
      <AspectComparison />
    </div>
  );
}
