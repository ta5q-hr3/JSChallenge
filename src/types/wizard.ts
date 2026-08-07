// 学習ウィザードで扱う「ステップ」、「学習データ」の型定義

/**
 * 学習ステップ コンテンツ
 */
export interface StepContent {
  stepNumber: number;
  title: string;
  explanation: string;
  codeExample?: string;// オプショナル(省略可)
  keyPoints: string[];
}

/**
 * 学習チャプター > 学習ステップ
 */
export interface ChapterDetail {
  chapterId: number;
  title: string;
  steps: StepContent[];
}

