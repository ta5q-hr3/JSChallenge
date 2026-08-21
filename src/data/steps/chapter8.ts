// CHAPTER 8

import { StepContent } from "@/types/wizard";

export const CHAPTER_8_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "学習ウィザードアプリの型定義とデータ構造設計",
explanation: "本アプリの要となる『章（Chapter）』『ステップ（Step）』『進捗状態（Progress）』の TypeScript インターフェースを設計します。データ構造を厳格に型定義することで、コンポーネント間の Props リレーや状態変更で型不整合が起きない頑丈な骨格（骨格筋）を作ります。",
codeExample: `// src/types/wizard.ts

export interface StepContent {
  stepNumber: number;
  title: string;
  explanation: string;
  codeExample: string;
  keyPoints: string[];
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  topics: string[];
}

export type ProgressMap = Record<number, number[]>; // { [chapterId]: [completedStepNumbers] }`,
keyPoints: [
  "データ構造（Domain Type）を単一の型ファイルに集約し、保守性を劇的に高める",
  "ProgressMap のように `{ [chapterId]: stepNumbers[] }` の形式にすることで、章ごとの完了状況を O(1) で高速判定",
],
},

// 2.
{
stepNumber: 2,
title: "コンポーネント分割と Atomic Design な視覚パーツの構築",
explanation: "画面（Page）にすべてを直接記述するのではなく、ヘッダー、章選択カード（ChapterCard）、ステッププログレスバー（ProgressBar）、コードハイライター（CodeBlock）などの再利用可能なコンポーネントへと切り出します。",
codeExample: `// src/components/wizard/ProgressBar.tsx
"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden dark:bg-slate-700">
      <div
        className="bg-emerald-500 h-full transition-all duration-300 ease-out"
        style={{ width: \`\${percentage}%\` }}
      />
    </div>
  );
}`,
keyPoints: [
  "単一責任の原則（SRP）に従い、UIパーツ単位でコンポーネントを分離してテスト・保守を容易にする",
  "Tailwind CSS の動的ユーティリティクラスを活用して、アニメーションやプログレス描画を実現",
],
},

// 3.
{
stepNumber: 3,
title: "ウィザード State 管理と LocalStorage による進捗の永続化",
explanation: "現在選択されている『章』と『ステップ』の移動ロジック（次へ/前へ）に加え、完了したステップをブラウザの LocalStorage へ保存・復元するカスタムフックを作成します。",
codeExample: `// src/hooks/useWizardProgress.ts
"use client";

import { useState, useEffect } from "react";
import { ProgressMap } from "@/types/wizard";

const STORAGE_KEY = "macho_wizard_progress_v1";

export function useWizardProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  // 1. 初回マウント時に LocalStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("進捗の復元に失敗しました", e);
      }
    }
  }, []);

  // 2. ステップ完了状態のトグル機能
  const toggleStepComplete = (chapterId: number, stepNumber: number) => {
    setProgress((prev) => {
      const currentSteps = prev[chapterId] || [];
      const isCompleted = currentSteps.includes(stepNumber);
      const updatedSteps = isCompleted
        ? currentSteps.filter((s) => s !== stepNumber)
        : [...currentSteps, stepNumber];

      const newProgress = { ...prev, [chapterId]: updatedSteps };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return { progress, toggleStepComplete };
}`,
keyPoints: [
  "useEffect のハイドレーションタイミングを意識し、SSR と LocalStorage 復元のギャップによるエラーをガード",
  "Custom Hook（`useWizardProgress`）として状態変化・永続化ロジックをカプセル化する",
],
},

// 4.
{
stepNumber: 4,
title: "型チェック・ESLint・ビルドエラーの完全制覇（All Out Build）",
explanation: "デプロイ前に `npm run build` をローカル環境（またはオンプレミス/コンテナ上）で実行し、TypeScript の型チェック（tsc）と ESLint の検証を通過させます。すべての型エラーをゼロにする追い込み（オールアウト）を行います。",
codeExample: `# 1. 型チェックのみを高速実行（tsconfig の noEmit モード）
npx tsc --noEmit

# 2. ESLint の自動修正とチェック
npm run lint

# 3. 本番用スタンドアロンビルドの検証
npm run build`,
keyPoints: [
  "Any型や未定義プロパティアクセスの警告を解消し、本番環境でのランタイムエラー発生率を0%に近づける",
  "Next.js 15 の非同期 Page Props（params/searchParams）の Promise 型適合を確実に確認",
],
},

// 5.
{
stepNumber: 5,
title: "【総仕上げ演習】本番デプロイ前 最終チェックリスト",
explanation:
  "Chapter1〜8で学んだ知識を総動員し、このウィザードアプリ自体を実際に本番環境へ公開してみましょう。デプロイの具体的な手順（Vercel CLI や Dockerfile の書き方）は Chapter7 で学んだ内容がそのまま使えます。ここでは再掲する代わりに、公開前に必ず確認すべき『最終チェックリスト』を通じて、これまでの学習内容を振り返ります。",
codeExample: `# ✅ 本番デプロイ前 最終チェックリスト

# 1. 型・Lint・ビルドが全てパスするか（Chapter8 Step4）
npx tsc --noEmit && npm run lint && npm run build

# 2. 環境変数は正しく設定されているか（Chapter7 Step4）
#    - .env.local に必要な値が全て入っているか
#    - 本番環境（Vercelのダッシュボード等）にも同じキーを登録したか
#    - NEXT_PUBLIC_ が本当に必要な変数だけに付いているか（機密情報に付けていないか）

# 3. .gitignore は適切か（Chapter7 Step5）
#    - .env* や node_modules がコミット対象から除外されているか
#    - git status で機密ファイルが追跡されていないか確認
git status

# 4. 認証・セキュリティ設定は本番URLに対応しているか（Chapter7 Step1〜3）
#    - OAuthプロバイダー（GitHub等）のコールバックURLを本番ドメインに登録したか
#    - Middlewareで保護すべきルートに漏れがないか

# 5. デプロイ実行（Chapter7 Step6の手順を参照）
npx vercel --prod
# または
# docker build -t macho-wizard-app . && docker run -p 3000:3000 macho-wizard-app
`,
keyPoints: [
  "デプロイの技術的な手順そのものはChapter7で習得済み。ここでは『デプロイ前に何を確認すべきか』というプロの視点でのチェックリスト運用を身につける",
  "特に環境変数と.gitignoreの確認は、機密情報の漏洩に直結するため本番公開前に必ず二重チェックする習慣をつける",
  "このチェックリストを通過したら、Chapter1から積み上げてきた型安全なTypeScript/React/Next.jsアプリケーションの完成です。お疲れ様でした！",
],
},

];
