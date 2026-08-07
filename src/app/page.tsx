"use client";

// Tips: Next.js (App Router) では src/app/ 直下に icon.svg を配置するだけで、自動的にファビコンとして認識・出力される仕組みになっているぞ！

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AmbientBackground from "@/app/components/AmbientBackground";
import styles from "./page.module.scss";

// メインメソッド
export default function FirstVewPage() {


const router = useRouter();
const [ isVisible, setIsVisible ] = useState(false);
const [ isLeaving, setIsLeaving ] = useState(false);// 遷移アニメーション用フラグ
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(
  () => {
    // prefers-reduced-motion(余計なアニメーションの削除)の検知
    const prefersReduceMotion = window.matchMedia(
      "(prefer-reduce-motion: reduce)"
    ).matches;

    const REVEAL_DELAY = prefersReduceMotion ? 0 : 1500;

    const timer = setTimeout(
      () => {
        setIsVisible(true);
        // 表示直後にフォーカスを渡し、キーボード操作の導線を確保する
        buttonRef.current?.focus( { preventScroll: true });
      },
      REVEAL_DELAY
    );

    return () => clearTimeout(timer);

  },
  []
); // useEffect()


// get start ボタンアクション
const handleStart = () => {
  // 吸い上げアニメーション
  setIsLeaving(true);
  // 吸い上げアニメーションの終了(500ms)後にページ遷移
  //setTimeout( () => {
  //  router.push( "/curriculum" );
  //});
};

// ボタンアクション後の画面遷移
//  ブラウザ自体が持っている onAnimationEnd イベント
//  CSSアニメーションが実際に終わった瞬間にブラウザから発行される onAnimationEnd イベント
//  ... を、Reactで取得して遷移を発火させる
//    [メリット]  アニメーションの定義をCSSのみで管理し、JSコード側での書き換えが発生しない
const handleAnimationEnd = (e: React.AnimationEvent) => {
  // 他の要素のアニメーションと混ざらないよう、対象の要素かをチェック
  if (isLeaving) {
    router.push( "/curriculum" );
  }
}




return(

<main className={`${styles.fv} ${isLeaving ? styles.isLeaving : ""}`}>
  {/** グリッド線の背景 
  <div className={styles.fvBg} aria-hidden="true" /> */}
  <AmbientBackground />

  <div 
    className={styles.fvContent} 
    onAnimationEnd={handleAnimationEnd}
  >

    <div className={styles.logo} role="img" aria-label="Self-Learning Wizard ロゴ">
      <div className={styles.logoStage}>
        <svg className={styles.logoBox} viewBox="84.1 22 171.8 196" aria-hidden="true">
          {/* キューブの3面 */}
          <polygon
            className={`${styles.boxFace} ${styles.boxFaceTop}`}
            points="170,30 247.9,75 170,120 92.1,75"
          />
          <polygon
            className={`${styles.boxFace} ${styles.boxFaceLeft}`}
            points="92.1,75 170,120 170,210 92.1,165"
          />
          <polygon
            className={`${styles.boxFace} ${styles.boxFaceRight}`}
            points="247.9,75 170,120 170,210 247.9,165"
          />

          {/* L / S / W テキスト */}
          <text
            className={`${styles.boxLetter} ${styles.boxLetterL}`}
            transform="matrix(0.779,0.45,-0.779,0.45,170,30)"
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
          >
            L
          </text>
          <text
            className={`${styles.boxLetter} ${styles.boxLetterS}`}
            transform="matrix(0.779,0.45,0,0.9,92.1,75)"
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
          >
            S
          </text>
          <text
            className={`${styles.boxLetter} ${styles.boxLetterW}`}
            transform="matrix(0.779,-0.45,0,0.9,170,120)"
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
          >
            W
          </text>
        </svg>
      </div>
    </div>{/** .Logo */}

    {/** タグライン */}
    <h1 className={styles.brand}>Self-Learning Wizard</h1>
    <p className={styles.tagline}>
      From TypeScript fundamentals to real-world Next.js implementation — your self-paced guide to mastering it all.
    </p>

    <button
      ref={buttonRef}
      type="button"
      className={`${styles.cta} ${isVisible ? styles.isVisible : ""}`}
      onClick={handleStart}
    >
      <span>Get Start</span>
    </button>

  </div>{/** .fvContent */}

</main>

);


} // FirstVewPage()


//