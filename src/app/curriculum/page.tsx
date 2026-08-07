"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MiniLogo from "@/app/components/MiniLogo";
import AmbientBackground from "@/app/components/AmbientBackground";
import { CHAPTERS_DATA } from "@/data/curriculum";
import styles from "./page.module.scss";


/**
 * メインメソッド
 */
export default function Curriculumpage() {


const router = useRouter();
const [isLeaving, setIsLeaving] = useState(false);// ページから離脱中か否か
const [targetChapterId, setTargetChapterId] = useState<number | null>(null);

// カード選択時のハンドラー
const handleCardClick = ( e: React.MouseEvent, chapterId: number ) => {
  e.preventDefault();// 通常の即時リンク遷移を停止
  setTargetChapterId(chapterId);
  setIsLeaving(true);// スライドアニメーションの開始
}

// アニメーション(isLeaving)が完了した後に遷移する
const handleAnimationEnd = ( e: React.AnimationEvent ) => {
  if (isLeaving && targetChapterId !== null) {
    router.push(`/learn?chapter=${targetChapterId}`);
  }
}


return (

<main 
  className={`${styles.curriculumContainer} ${isLeaving ? styles.isLeaving : ""}`}
  onAnimationEnd={handleAnimationEnd}
>

{/** 背景要素 
<div className={styles.bg} aria-hidden="true" /> */}
<AmbientBackground />

<div className={styles.content}>

<header className={styles.header}>
  <Link href="/" className={styles.logoLink} title="トップページへ戻る"><MiniLogo /></Link>
  <h1 className={styles.title}>カリキュラム一覧</h1>
  <p className={styles.subtitle}>
    各章をクリックして、ステップバイステップのトレーニングを開始しよう。
  </p>
</header>

{/** チャプターリスト */}
<div className={styles.grid}>
  { CHAPTERS_DATA.map(
    (chapter) => (
      // チャプターidをキーに遷移
      <a
        key={chapter.id}
        href={`/learn?chapter=${chapter.id}`}
        onClick={ (e) => handleCardClick(e, chapter.id) }
        className={styles.cardLink}
      >
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.badge}>CHAPTER {chapter.id}</span>
            <h2>{chapter.title}</h2>
          </div>
          <p className={styles.description}>{chapter.description}</p>
          <ul className={styles.topicList}>
            {chapter.topics.map((topic, idx) => (
              <li key={idx}>✓ {topic}</li>
            ))}
          </ul>
        </div>
      </a>
    )
  )}
</div>

</div>{/** .content */}

</main>

);// return

}
