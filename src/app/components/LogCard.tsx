// app/components/LogCard.tsx
import styles from "./LogCard.module.scss";

// propsの型定義
interface LogCardProps {
  title: string;
  duration: number;
}

// 🔥 【TODO 1】
// 親コンポーネントから渡される props を、「分割代入」を使って受け取るように
// 以下のカッコの中を書き換えてください。
export const LogCard = ( {title, duration}: LogCardProps ) => {
  return (
    <div className={styles.card}>
      {/* 分割代入で受け取った変数をそのまま表示する */}
      <h4>{title}</h4>
      <p>学習時間: {duration}分</p>
    </div>
  );
};