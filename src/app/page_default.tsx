// app/page.tsx
// トップページ

import Link from "next/link";
import styles from "./page.module.scss"

// 各章のカード形式表示のデータ構造
interface Chapter {
  id:     number;
  title:  string;
  description:  string;
  topics:  string[];
}

// /////
//カードに記載するデータ
// /////
const chapters: Chapter[] = [
  {
    id: 1,
    title: "第1章: TypeScriptの基礎と環境整備",
    description: "型安全性がもたらす壊れないコードと、Node.js / tsconfigの基礎を固める",
    topics: ["型推論と明示的型定義", "tsconfig.jsonの役割", "パッケージマネージャの選定"],
  },
  {
    id: 2,
    title: "第2章: TypeScriptの実践テクニック",
    description: "GenericsやUtility Typesを使いこなし、型定義の壁を突破する",
    topics: ["Interface vs Type Alias", "Genericsの応用", "Utility Types (Pick/Omit)"],
  },
  {
    id: 3,
    title: "第3章: Reactの基礎知識",
    description: "コンポーネント指向とHooksを理解し、TSと組み合わせる",
    topics: ["JSX/TSXとVirtual DOM", "Props & State管理", "TypeScript × React Hooks"],
  },
  {
    id: 4,
    title: "第4章: Next.jsの基礎と環境整備",
    description: "App Routerのアーキテクチャとディレクトリ構造をマスターする",
    topics: ["SSR / SSG / RSCの概念", "create-next-appの構造", "App Routerのルーティング"],
  },
  {
    id: 5,
    title: "第5章: Next.jsの実践開発",
    description: "Server ComponentsとServer Actionsを活用した実践的開発",
    topics: ["RSC vs Client Components", "Data Fetching", "Dynamic Routing & 画像最適化"],
  },
  {
    id: 6,
    title: "第6章: アプリケーション開発実践",
    description: "本学習アプリを自力で構築し、Vercel/Dockerへデプロイする",
    topics: ["コンポーネント分割", "ウィザードState実装", "ビルド & デプロイ"],
  },
];


// メインメソッド
export default function HomePage() {

return (
<main className="container">

{/**
  * ヒーローセクション
  */}
<section className={styles.hero}>
  <h1 className={styles.title}>
    Next.js & TypeScript <br />
    <span className={styles.highlight}>Self-Learning Wizard</span>
  </h1>
  <p className={styles.subtitle}>
    コード例を見ながら、今動いているアプリそのものを開発して学ぶ、さながら自重トレーニング型学習プラットフォーム。
  </p>
  <div className={styles.actionArea}>
    <Link href="/learn" className={styles.startButton}>
      学習を開始する
    </Link>
  </div>
</section>

{/**
  * 学習コンテンツ(カリキュラム)一覧
  */}
<section className={styles.curriculumSection}>
  <h2 className={styles.sectionTitle}>学習カリキュラム一覧</h2>
  <div className={ styles.grid }>
    {/** map() . chapters */}
    {
      chapters.map(
        (chapter) => (
          <div key={ chapter.id } className={ styles.card }>
            {/** HEADER */}
            <div className={ styles.cardHeader }>
              <span className={ styles.chapterBadge }>CAHPTER { chapter.id }</span>
              <h3>{ chapter.title }</h3>
            </div>
            {/** CONTENTS */}
            <p className={ styles.cardDescription }>{ chapter.description }</p>
            <ul className={ styles.topicList }>
              {/** map() . chapters . topics */}
              {
                chapter.topics.map(
                  ( topic, index ) => (
                    <li key={ index }>✓ { topic }</li>
                  )
                )
              }
            </ul>
          </div>
        )
      )
    }
  </div>{/** styles.grid */}
</section>

</main>
);

}






//