// CHAPTER 1
import { StepContent } from "@/types/wizard";

export const CHAPTER_1_STEPS: StepContent[] =[

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

// オブジェクトの型定義
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

// 2.
{
stepNumber: 2,
title: "tsconfig.json の役割と最適化",
explanation:
  //"tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定します。strict モードを有効化することで、最高の型安全性を手に入れましょう。",
  "tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定します。特にstrictモードを有効化('strict: true')することで、Null/Undefinedの未チェックや暗黙のany型を許さない、強力な型安全性を利用できます。",
codeExample: `{
  "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "lib": ["DOM", "DOM.Iterable", "ESNext"],
      "jsx": "preserve", // preserve（そのまま出力）, react（React.createElement に変換）, react-jsx (React 17 以降の新しい JSX 変換です。react/jsx-runtime から自動で関数をインポートするため、手動での React インポートが不要に)
                        // react-jsxdev (react-jsx と同様ですが、開発向けのデバッグ情報を付与して出力), react-native (JSX を変更せず、React Native 向けの .js ファイルとして出力)
      "strict": true,                   /* 厳格な型チェックを全て有効化。ちなみにこの設定値だけで下のnoImplicitAnyとstrictNullChecksも有効になります */
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

// 3.
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
    default:
      const _exhaustiveCheck: never = state.status;
      return _exhaustiveCheck;
  }
}`,
keyPoints: [
  "取り得る値を限定（Literal化）して、タイポや不正な値をコンパイル時点でブロック",
  "switch 文と組み合わせることで、漏れのない条件分岐（Exhaustiveness check）が可能",
],
},


]