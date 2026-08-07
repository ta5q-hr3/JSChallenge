// 画面上部のロゴ
import styles from "./MiniLogo.module.scss";

export default function MiniLogo() {
  return (
    <div className={styles.miniLogoStage} role="img" aria-label="Self-Learning Wizard">
      <svg className={styles.miniLogoBox} viewBox="84.1 22 171.8 196">
        <polygon className={styles.top} points="170,30 247.9,75 170,120 92.1,75" />
        <polygon className={styles.left} points="92.1,75 170,120 170,210 92.1,165" />
        <polygon className={styles.right} points="247.9,75 170,120 170,210 247.9,165" />
      </svg>
    </div>
  );
}