/**
 * グリッド背景
 */

import styles from "./AmbientBackground.module.scss";

interface AmbientBackgroundProps {
  opacity?: number; // オプショナル(省略可)
}


export default function AmbientBackground({ opacity=0.7}: AmbientBackgroundProps) {

return (

<div 
  className={styles.bg}
  style={{ opacity }}
  aria-hidden="true"
/>

);

}