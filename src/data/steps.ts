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
 */

import { StepContent } from "@/types/wizard";


// 実装時サンプルデータ ... 第１章のステップコンテンツ
export const CHAPTER_STEPS: Record<number, StepContent[]> = {

1: [

// 1.
{
stepNumber: 1,
title: "型推論（Type Inference）と明示的型定義",
explanation: "TypeScript(のコンパイラ)は値から自動的に型を推論してくれるので、変数には名前と値だけを渡してしまいがちです。ですが、それだけだと変数の中に何が入っているかがコードが進むにつれてわからなくなってしまうことがよく起こります。そこで関数の引数や戻り値などには明示的な型定義（Type Annotation）を行うことで、コードの安全性が一気に高まります。",
codeExample:`// 型推論（TypeScriptが自動でnumberと判断）
let count = 10;

// 関数の引数・戻り値に対する明示的な型定義
function add(a: number, b: number): number {
return a + b;
}

// オブジェクトの方定義
interface UserProfile {
  id: string;
  name: string;
  isAdmin: boolean;
}

const currentUser: UserProfile = {
  id: "usr_001",
  name: "Type Sc Student",
  isAdmin: true,
};
`,
keyPoints: [
  "変数初期化時は型推論に任せるのが基本(ローカル変数は原則として型推論に任せて可読性を維持する)",
  "関数の引数と戻り値には必ず明示的な型をつけ安全性を確保する",
  "Interface や Type alias を使ってデータ構造の形を厳格に定義し、コンパイルエラーを未然に防ぐ基礎を習得する",
],
},
// 2
{
stepNumber: 2,
title: "tsconfig.json の役割と最適化",
explanation:
  //"tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定します。strict モードを有効化することで、最高の型安全性を手に入れましょう。",
  "tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定します。特にstictモードを有効化('strict: true')することで、Null/Undefinedの未チェックや暗黙のany型を許さない、強力な型安全性を利用できます。",
codeExample: `{
  "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "lib": ["DOM", "DOM.Iterable", "ESNext"],
      "jsx": "preserve", // preserve（そのまま出力）, react（React.createElement に変換）, react-jsx (React 17 以降の新しい JSX 変換です。react/jsx-runtime から自動で関数をインポートするため、手動での React インポートが不要に)
                        // react-jsxdev (react-jsx と同様ですが、開発向けのデバッグ情報を付与して出力), react-native (JSX を変更せず、React Native 向けの .js ファイルとして出力)
      "strict": true,                   /* 厳格な型チェックを全て有効化 */
      "noImplicitAny": true,            /* 暗黙の any 型を禁止 */
      "strictNullChecks": true,         /* null / undefined のチェックを徹底 */
      "noUnusedLocals": true,           /* 使われていないローカル変数をエラー化 */
      "paths": {
        "@/*": ["./src/*"]              /* パスエイリアスの設定 */
      }
  }
}`,
keyPoints: [
  "target で変換先のJavaScriptバージョンを指定",
  "strict: true は有効化を推奨の設定。「基本的には有効化」をルールにしよう",
  "strictNullChecks により、予期せぬ Null Pointer エラーへの対策にも万全な体制を築こう",
  "プロジェクト規模に応じたパスエイリアス（@/）設定も便利。相対パス記述の混乱をを激減させよう",
],
},
// 3
{
stepNumber: 3,
title: "Union型とLiteral型による状態表現",
explanation:
  "単なる string 型や number 型ではなく、特定の文字列や数値しか受け付けない「Literal型」と、それらを組み合わせる「Union型（共用体型）」を使うことで、不正な値の混入を完璧に防ぐことができます。",
codeExample: `// ステータスとして許可する文字列のみを絞り込む（Literal Union）
type TrainingStatus = "idle" | "loading" | "success" | "error";

interface TaskState {
  status: TrainingStatus;
  errorMessage?: string;
}

function handleState(state: TaskState) {
  switch (state.status) {
    case "idle":
      console.log("スタンバイ完了！");
      break;
    case "loading":
      console.log("追い込み中...");
      break;
    case "success":
      console.log("オールアウト！大成功！");
      break;
    case "error":
      console.error(state.errorMessage ?? "予期せぬエラー");
      break;
  }
}`,
keyPoints: [
  "取り得る値を限定（Literal化）して、タイポや不正な値をコンパイル時点でブロック",
  "switch 文と組み合わせることで、漏れのない条件分岐（Exhaustiveness check）が可能",
],
},

],

// ２章以降は下記に追加
// --- 第2章：TypeScriptの実践テクニック ---
  2: [
    {
      stepNumber: 1,
      title: "Interface & Type Alias の基礎と使い分け",
      explanation:
        "オブジェクトの「形」を定義する2大ツールです。拡張性（extends / 宣言の自動結合）に優れた Interface と、Union型やプリミティブ型などあらゆる型に名前をつけられる Type Alias の特徴を理解し、チームで一貫したフォームを保ちましょう。",
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
    {
      stepNumber: 2,
      title: "Generics（抽象型）で再利用性を極限まで高める",
      explanation:
        "型を引数のように外部から受け取ることで、コードの再利用性と型安全性を完璧に両立させるテクニックです。APIレスポンスの共通ラッパーや汎用コンポーネントの構築に欠かせません。",
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
    {
      stepNumber: 3,
      title: "Utility Types (Pick / Omit) による型の再利用",
      explanation:
        "既存の大きな型から、必要なプロパティだけを「抽出（Pick）」したり「除外（Omit）」したりして新しい型を作り出します。重複コードを撲滅し、元データの変更に強い設計を実現します。",
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
    {
      stepNumber: 4,
      title: "【応用】Discriminated Unions & as const",
      explanation:
        "共通の識別子（tag）を持たせることで型の分岐を100%安全にする Discriminated Unions と、オブジェクトを完全な読み取り専用＆リテラル型化する 'as const' をマスターすれば、TypeScriptの本当の深淵に到達できます。",
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
  ],


// 3章


// 4章
}