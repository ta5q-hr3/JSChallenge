// CAHPTER 2
import { StepContent } from "@/types/wizard";

export const CHAPTER_2_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "Interface & Type Alias の基礎と使い分け",
explanation: "オブジェクトの「形」を定義する2大ツールです。拡張性（extends / 宣言の自動結合）に優れた Interface と、Union型やプリミティブ型などあらゆる型に名前をつけられる Type Alias の特徴を理解し、チームで一貫したフォームを保ちましょう。",
codeExample: `// 1. Interface: オブジェクト構造の定義と extends による拡張
interface BaseUser {
  id: string;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
}

// 2. Type Alias: 柔軟な型の定義（Union型やTuple型など）
type UserRole = "admin" | "editor" | "viewer"; // Literal Union
type Point = [number, number]; // Tuple

type UserWithRole = BaseUser & {
  role: UserRole;
};`,
keyPoints: [
  "オブジェクトやクラスの設計には Interface を優先して拡張性を確保",
  "Union型・Tuple・関数の型シグネチャ・組み換えには Type Alias が圧倒的に優位",
  "Interface は同名で複数宣言すると自動で結合（Declaration Merging）される点に注意",
],
},

// 2.
{
stepNumber: 2,
title: "Generics（抽象型）で再利用性を極限まで高める",
explanation: "型を引数のように外部から受け取ることで、コードの再利用性と型安全性を完璧に両立させるテクニックです。APIレスポンスの共通ラッパーや汎用コンポーネントの構築に欠かせません。",
codeExample: `// 汎用的な API レスポンスの型定義（Tが動的に決まる）
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 具体的なデータ型を指定して呼び出し
interface UserData {
  userId: number;
  username: string;
}

type UserResponse = ApiResponse<UserData>;

// Generics を持つ関数（T extends object で型の制約も付与可能）
function wrapInArray<T>(item: T): T[] {
  return [item];
}

const numberArray = wrapInArray(100); // number[] と自動推論！`,
keyPoints: [
  "Generics を使うことで 'any 型' に逃げずに柔軟な汎用処理が書ける",
  "'<T extends CustomType>' のように extends を使うことで受け取れる型に制約をかけられる",
],
},

// 3.
{
stepNumber: 3,
title: "Utility Types (Pick / Omit) による型の再利用",
explanation: "既存の大きな型から、必要なプロパティだけを「抽出（Pick）」したり「除外（Omit）」したりして新しい型を作り出します。重複コードを撲滅し、元データの変更に強い設計を実現します。",
codeExample: `interface Article {
id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 新規作成時（idや日付はサーバー生成のため除外したい）-> Omit
type CreateArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;

// 一覧画面用（軽量化のためタイトルと著者だけ抽出したい）-> Pick
type ArticleListItem = Pick<Article, "id" | "title" | "authorId">;`,
keyPoints: [
  "Omit<T, K>: 指定したキー K を削り落とした型をビルド",
  "Pick<T, K>: 指定したキー K だけをピックアップした型をビルド",
  "元になる Interface が更新された際、派生型も自動追従するためメンテナンス性が激増",
],
},

// 4.
{
stepNumber: 4,
title: "【応用】Discriminated Unions & as const",
explanation: "共通の識別子（tag）を持たせることで型の分岐を100%安全にする Discriminated Unions と、オブジェクトを完全な読み取り専用＆リテラル型化する 'as const' をマスターすれば、TypeScriptの本当の深淵に到達できます。",
codeExample: `// as const でオブジェクトの値を変更不可＆リテラル型化！
const CONFIG = {
  API_ENDPOINT: "https://api.example.com",
  MAX_RETRIES: 3,
} as const;

// Discriminated Unions（状態管理のベストプラクティス）
type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function renderState(state: AsyncState<string>) {
  if (state.status === "loading") {
    return "読み込み中...";
  }
  if (state.status === "success") {
    // ここでは TypeScript が自動で 'data' が存在すると確定してくれる！
    return state.data.toUpperCase();
  }
  return state.error.message;
}`,
keyPoints: [
  "as const をつければ、単なる string ではなく '特定の値そのもの' として型定義できる",
  "Discriminated Unions により、if や switch で条件分岐した際に型が完全に絞り込まれる（Type Narrowing）",
],
},


]