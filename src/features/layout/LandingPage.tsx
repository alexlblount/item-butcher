import styles from './LandingPage.module.css';
import howToStart from '@src/assets/how-to-start-min.png';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.title}>How to Get Started</header>
      <img className={styles.howToImage} src={howToStart} alt="How to get started" />

      <div className={styles.step}>Step 1</div>
      <p>Open the inventory and hover over an item or aspect.</p>

      <div className={styles.step}>Step 2</div>
      <p>Using a snipping tool, capture the item details. (Windows Snipping Tool, Snip & Sketch, etc.).</p>
      <p>Try to get the area outlined by the blue line. Omit sockets and any extra text if possible.</p>

      <div className={styles.step}>Step 3</div>
      <p>Click any where on the page and paste the image. You should see your item on the Vault tab.</p>
      <p>If your items have aspects, you can compare aspects of the same type on the Aspects tab.</p>
    </div>
  );
}
