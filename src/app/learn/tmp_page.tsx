function () {

return (
  {/* ナビゲーションバー */}
  <div className={styles.topNav}>
    <Link href="/curriculum" className={styles.backLink}>
      ← カリキュラム一覧へ戻る
    </Link>
    <div className={styles.stepIndicator}>
      STEP {currentStep.stepNumber} / {sampleSteps.length}
    </div>
  </div>

  {/* ウィザードメインカード */}
  <div className={styles.wizardCard}>
    <header className={styles.header}>
      <span className={styles.chapterTag}>第1章: TypeScriptの基礎</span>
      <h1 className={styles.title}>{currentStep.title}</h1>
    </header>

    <section className={styles.content}>
      <p className={styles.explanation}>{currentStep.explanation}</p>

      {/* コード例がある場合のみ表示 */}
      {currentStep.codeExample && (
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>TypeScript Example</div>
          <pre>
            <code>{currentStep.codeExample}</code>
          </pre>
        </div>
      )}

      {/* ポイントリスト */}
      <div className={styles.pointsBlock}>
        <h3>💪 ポイント解説</h3>
        <ul>
          {currentStep.keyPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
    </section>

    {/* ステップ操作ボタン */}
    <footer className={styles.footer}>
      <button
        type="button"
        className={styles.prevButton}
        onClick={handlePrev}
        disabled={isFirstStep}
      >
        前へ
      </button>
      <button
        type="button"
        className={styles.nextButton}
        onClick={handleNext}
        disabled={isLastStep}
      >
        {isLastStep ? "完了！" : "次へ進む →"}
      </button>
    </footer>
  </div>

);

}