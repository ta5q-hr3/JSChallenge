// CHAPTER.8

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
  "Tailwind CSS の動的ユーティリティクラスを活用して、パンプアップしたアニメーションやプログレス描画を実現",
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
title: "Vercel & Docker コンテナへの本番デプロイと動作確認",
explanation:
  "ビルドを完了したアプリを GitHub リポジトリ経由で Vercel にデプロイ、または `output: 'standalone'` を利用した Dockerfile でマルチステージビルドを行い、クラウドやオンプレミスの Linux サーバ上で世界に公開します。",
codeExample: `# Vercel CLI を使ったターミナル一括デプロイの例
npx vercel --prod

# Docker を利用したローカル/オンプレ環境での本番コンテナ起動の例
docker build -t macho-wizard-app .
docker run -p 3000:3000 -e NODE_ENV=production macho-wizard-app`,
keyPoints: [
  "Vercel: Git Push に連動した CI/CD と Preview Deployment による爆速リリース体験",
  "Docker: `output: 'standalone'` により最小限の Node.js 実行環境でどこでもポータブルに稼働させることが可能",
],
},

];

