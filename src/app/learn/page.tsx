"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
// Readonly URL search : Client Component hook that lets you read the current URL's search parameters.
import { useSearchParams } from "next/navigation";
// カルーセル
import useEmblaCarousel from "embla-carousel-react";
// シンタックスハイライト
import { Prism as SynyaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// 学習内容
//import { StepContent } from "@/types/wizard";
import { CHAPTER_STEPS } from "@/data/steps";
import { CHAPTERS_DATA } from "@/data/curriculum";

import MiniLogo from "@/app/components/MiniLogo";
import styles from "./page.module.scss";


/**
 * メインメソッド
 */
export default function LearnPage() {


const searchParams = useSearchParams();
const chapterId = Number(searchParams.get( "chapter" )) || 1;

const steps = CHAPTER_STEPS[chapterId] || CHAPTER_STEPS[1];
const currentChapter = CHAPTERS_DATA.find( (chap) => chap.id === chapterId );
const nextChapter = CHAPTERS_DATA.find( (chap) => chap.id === chapterId + 1 );

/**
 * カルーセルライブラリ Embla Carouselの初期化 (ループなし。中央整列)
 */
const [ emblaRef, emblaApi ] = useEmblaCarousel({ loop: false, align:"center" });
const [ selectedIndex, setSelectedIndex ] = useState(0);

// カルーセル操作
const onSelect = useCallback( () => {
  if (!emblaApi) return;
  setSelectedIndex( emblaApi.selectedScrollSnap() );
}, 
[emblaApi]
);

useEffect( () => {
  if (!emblaApi) return;
  emblaApi.on( "select", onSelect );
  onSelect();
}, 
[ emblaApi, onSelect ]
);

const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
const scrollNext = () => emblaApi && emblaApi.scrollNext();


/*
// 更新後変数と更新関数 定義
const [ currentStepIndex, setCurrentStepIndex ] = useState(0);
const currentStep = sampleSteps[currentStepIndex];
const isFirstStep = currentStepIndex === 0; // 最初のステップ(index 0)を表示しているか
const isLastStep = currentStepIndex === sampleSteps.length -1;// 最後のステップを表示しているか

//
// ステップの前進・後進
// 
const handleNext = () => {
  // 最後のステップでなければ +1
  if (!isLastStep) setCurrentStepIndex(
    (prev) => prev + 1
  );
};

const handlePrev = () => {
  //
  if (!isFirstStep) setCurrentStepIndex(
    (prev) => prev - 1
  );
}
*/


//
// Return
//
return (

<main className={styles.learnContainer}>

{/** 上段ヘッダー */}
<header className={styles.topNav}>
  <Link href="/curriculum" className={styles.backLink}>← 一覧へ</Link>
  <div className={styles.logoWrapper}>
    <MiniLogo />
  </div>
  <div className={styles.stepIndicator}>
    STEP {Math.min(selectedIndex + 1, steps.length)} / {steps.length}
  </div>
</header>

{/** カルーセルエリア */}
<div className={styles.embla} ref={emblaRef}>
  <div className={styles.emblaContainer}>

  {/** 各ステップのスライド */}
  {steps.map(
      (step, idx) => (
        <div className={styles.emblaSlide} key={idx}>
          <div className={styles.wizardCard}>
            <span className={styles.chapterTag}>
            CHAPTER {chapterId}: {currentChapter?.title}
            </span>
            <h1 className={styles.title}>{step.title}</h1>
            <p className={styles.explanation}>{step.explanation}</p>

            {/** シンタックスハイライト付きコード例 */}
            {step.codeExample && (
                <div className={styles.codeWrapper}>
                  <SynyaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: "8px", fontSize: "0.85rem" }}
                  >
                    {step.codeExample}
                  </SynyaxHighlighter>
                </div>
              )
            }

            {/** ポイント解説 */}
            <div className={styles.pointBlock}>
              <h3>💪 ポイント解説</h3>
              <ul>
                {step.keyPoints.map(
                  (point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  )
                )}
              </ul>
            </div>

          </div>{/** .wizardCard  */}
        </div>//{/** .embalaSlide  */}
      )
  )}

  {/** 最終スライド: 次のカリキュラムの案内 */}
  <div className={styles.emblaSlide}>
    <div className={`${styles.wizardCard} ${styles.nextChapterCard}`}>
      <div className={styles.clearBadge}>🎉 CHAPTER CLEAR!</div>
      <h2>第{chapterId}章のトレーニング完了！</h2>
      <p>Congratulations! You're making steady progress in your learning!</p>
      {/** nextChapterの有無で切り替え */}
      {nextChapter ? (
        <div className={styles.nextPreview}>
          <span className={styles.nextLabel}>NEXT CHAPTER</span>
          <h3>{nextChapter.title}</h3>
          <p>{nextChapter.description}</p>
          <Link
            href={`/learn?chapter=${nextChapter.id}`}
            className={styles.nextChapterButton}
          >次の章へ進む →</Link>
        </div>
      ) : (
        <div className={styles.completeBox}>
          <h3>🏆 全カリキュラム完走！</h3>
          <p>Congratulations on finishing the course! Your technical skills must have improved tremendously!</p>
          <Link href="/curriculum" className={styles.nextChapterButton}>カリキュラム一覧へ戻る</Link>
        </div>
      )
      }

    </div>{/** .wizardCard .nextChapterCard */}
  </div>{/** .emblaSlide */}

  </div>{/** .emblaContainer */}
</div>{/** .embla */}

{/** 前・後 コントロールボタン */}
<button 
  type="button"
  className={`${styles.fixedNavButton} ${styles.prev}`}
  onClick={scrollPrev}
  disabled={selectedIndex === 0}
  aria-label="前のステップへ"
><span>‹</span></button>

<button 
  type="button"
  className={`${styles.fixedNavButton} ${styles.next}`}
  onClick={scrollNext}
  disabled={!emblaApi?.canScrollNext()}
  aria-label="次のステップへ"
><span>›</span></button>


{/** 下段のコントロールボタン */}
{/**
<footer className={styles.controls}>

<button
  className={styles.navButton}
  onClick={scrollPrev}
  disabled={selectedIndex === 0}
> ← 前へ </button>

<button
  className={`${styles.navButton} ${styles.primary}`}
  onClick={scrollNext}
  disabled={!emblaApi?.canScrollNext()}
> 次へ → </button>

</footer>
 */}

</main>
    
);


}// main method


