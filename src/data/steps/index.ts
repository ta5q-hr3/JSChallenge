/**
 * 掲載コンテンツデータ
 * ファイル構成
 src/
  data/
    steps/
      chapter1.ts   <-- 第1章のコンテンツファイル
      chapter2.ts   <-- 第2章のコンテンツファイル
      ... 
      index.ts      <-- 統合ファイル
 * 
 * chpaterX.tsを統合する
 */
import { StepContent } from "@/types/wizard";
import { CHAPTER_1_STEPS } from "./chapter1";
import { CHAPTER_2_STEPS } from "./chapter2";
import { CHAPTER_3_STEPS } from "./chapter3";
import { CHAPTER_4_STEPS } from "./chapter4";
import { CHAPTER_5_STEPS } from "./chapter5";
import { CHAPTER_6_STEPS } from "./chapter6";
import { CHAPTER_7_STEPS } from "./chapter7";
import { CHAPTER_8_STEPS } from "./chapter8";


export const CHAPTER_STEPS: Record<number, StepContent[]> = {
  1: CHAPTER_1_STEPS,
  2: CHAPTER_2_STEPS,
  3: CHAPTER_3_STEPS,
  4: CHAPTER_4_STEPS,
  5: CHAPTER_5_STEPS,
  6: CHAPTER_6_STEPS,
  7: CHAPTER_7_STEPS,
  8: CHAPTER_8_STEPS,
};

