/**
 * 掲載コンテンツデータ
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
  "tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定します。特に 'strict: true' オプションをONにすることで、Null/Undefinedの未チェックや暗黙のany型を許さない、引き締まった型チェックを有効化できます。",
codeExample: `{
"compilerOptions": {
"target": "ES2022",
"module": "ESNext",
"strict": true, // 厳格な型チェックを有効化

},

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
  "strict: true は必須の設定",
  "target で変換先のJavaScriptバージョンを指定",
  "プロジェクト規模に応じたパスエイリアス（@/）設定も便利",
],
},
// 3
{
stepNumber: 3,
title: "パッケージマネージャの選定",
explanation:
  "npm、yarn、pnpm などのパッケージマネージャは、依存ライブラリを素早く・正確に管理するための必須ツールです。それぞれの特徴を理解して選びましょう。",
keyPoints: [
  "npm: 標準搭載で安心感がある",
  "pnpm: ディスク容量を節約し、インストールが爆速",
  "チーム開発では lock ファイルの管理が肝心",
],
},

],

// ２章以降は下記に追加

}