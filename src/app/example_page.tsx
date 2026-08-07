// app/page.tsx
import { LogCard } from "./components/LogCard";

// 🔥 【TODO 2】
// 同一階層にあるスタイルシート "page.module.scss" を
// "styles" という名前のオブジェクトとしてインポートしてください。
// ここにTODO 2の記述をする
import styles from "./page.module.scss";


export default function DashboardPage() {
  // サーバー側で取得したと想定するデータ配列
  const recentLogs = [
    { id: "1", title: "Next.jsのルーティング", duration: 45 },
    { id: "2", title: "SASSのモジュール化", duration: 30 },
  ];

  return (
    // 🔥 【TODO 3】
    // インポートした styles オブジェクトを利用して、
    // この main タグに "container" というクラス名を適用してください。
    <main className={ styles.container }>
      <h1 className={styles.title}>ダッシュボード</h1>
      
      {recentLogs.map((log) => (
        // 🔥 【TODO 4】
        // LogCardコンポーネントを呼び出し、mapで展開中の log オブジェクトから
        // 「title」と「duration」の値を props としてそれぞれ渡してください。
        <LogCard 
          key={log.id}
          /* ここにTODO 4の記述をする */
          title={log.title}
          duration={log.duration}
        />
      ))}
    </main>
  );
}