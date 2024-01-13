import styles from './AspectPage.module.css';
import AspectDropdown from './AspectDropdown';

export default function AspectPage() {
  return (
    <div className={styles.page}>
      <AspectDropdown />
    </div>
  );
}
