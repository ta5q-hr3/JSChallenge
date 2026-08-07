// 実装時サンプルデータ ... 第１章のステップコンテンツ
const sampleSteps: StepContent[] = [
/*
StepContent
{
stepNumber: number;
title: string;
explanation: string;
codeExample?: string;
keyPoints: string[];
}*/

// 1.
{
stepNumber: 1,
title: "型推論と明示的型定義",
explanation: "TypeScriptは、値から自動的に型を推論してくれますが、関数の引数や戻り値などには明示的な型定義（Type Annotation）を行うことで、コードの安全性が一気に高まります。",
codeExample:`// 型推論（TypeScriptが自動でnumberと判断）
let count = 10;

// 明示的型定義
function add(a: number, b: number): number {
return a + b;
}`,
keyPoints: [
  "変数初期化時は型推論に任せるのが基本",
  "関数の引数と戻り値には必ず明示的な型をつける",
  "コンパイルエラーを未然に防ぐ基礎",
],
},
// 2
{
stepNumber: 2,
title: "tsconfig.json の役割と最適化",
explanation:
  "tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定するトレーニングマニュアルです。strict モードを有効化することで、最高の型安全性を手に入れましょう。",
codeExample: `{
"compilerOptions": {
"target": "ES2022",
"module": "ESNext",
"strict": true, // 厳格な型チェックを有効化
"jsx": "preserve"
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

];
