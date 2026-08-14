// CHAPTER 1
import { StepContent } from "@/types/wizard";

export const CHAPTER_1_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "変数宣言とプリミティブ型・配列・タプル",
explanation: "TypeScriptでは、'let' や 'const' を使った変数宣言時に「: 型名」という記法（型注釈 / Type Annotation）を書くことで、その変数に入る値の型を明示できます。この記法を使って、まずは文字列・数値・真偽値といった基本的な型（プリミティブ型）と、複数の値をまとめて扱う配列・タプルの書き方を押さえましょう。",
codeExample:`// 変数宣言の基本記法：let 変数名: 型名 = 値;
let userName: string = "Taro";
let age: number = 25;
let isActive: boolean = true;

// 型注釈を省略すると、TypeScriptが値から自動で型を推論する（詳しくはStep2）
let city = "Fukuoka"; // string型と自動判断される

// 配列の型定義（書き方は2種類あるが、意味は同じ）
let scores: number[] = [80, 90, 100];
let names: Array<string> = ["Alice", "Bob"];

// タプル型：要素数と各要素の型・並び順を固定した配列
let point: [number, number] = [10, 20];
let userTuple: [string, number, boolean] = ["Taro", 25, true];

// タプルは型や順番が異なるとコンパイルエラーになる
// let wrongTuple: [number, number] = [10, "20"]; // ❌ Error: 2番目はnumber型でなければならない
`,
keyPoints: [
  "変数宣言時は「let/const 変数名: 型名 = 値」という記法（型注釈）で型を明示できる",
  "配列は「型[]」と「Array<型>」のどちらでも同じ意味。プロジェクト内で表記を統一するのが望ましい",
  "タプルは「要素数固定・順序固定」の特殊な配列で、座標（x, y）やRGB値など意味の決まった組データの表現に向く",
  "通常の配列は「同じ型の値が何個でも入りうる集合」、タプルは「決まった型が決まった順番で並ぶ組」という使い分けを意識する",
],
},

// 2.
{
stepNumber: 2,
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

// Type alias（型エイリアス）：interfaceと同様に、型に名前をつけて再利用できる
// "type 名前 = 型" という記法で定義する
type UserId = string;

const targetUserId: UserId = "usr_001";
`,
keyPoints: [
  "変数初期化時は型推論に任せるのが基本(ローカル変数は原則として型推論に任せて可読性を維持する)",
  "関数の引数と戻り値には必ず明示的な型をつけ安全性を確保する",
  "Interface や Type alias を使ってデータ構造の形を厳格に定義し、コンパイルエラーを未然に防ぐ基礎を習得する",
  "Type alias（type）は、interfaceと同じく型に名前をつける仕組みだが、Union型やプリミティブ型など、より幅広い型に使える点が特徴。Union型との組み合わせ方はこの章のStep6で扱う",
],
},

// 3.
{
stepNumber: 3,
title: "any / unknown / never の違いと使い分け",
explanation: "TypeScriptには「型が不明な値」や「起こりえない状態」を表す特殊な型があります。'any' は型チェックを完全に放棄する最終手段、'unknown' は安全性を保ったまま未知の値を扱うための型、'never' は「絶対に発生しない」ことを型レベルで保証するための型です。この3つの違いを理解することは、型安全なコードを書くうえで避けて通れません。",
codeExample:`// any: 型チェックを放棄する（極力使用を避けるべき「最終手段」）
let anyValue: any = "hello";
anyValue = 100; // 何を代入してもコンパイルエラーにならない（危険）
anyValue.foo.bar.baz; // 存在しないプロパティへのアクセスすら実行時までエラーに気づけない

// unknown: any同様どんな値も代入できるが、"使う前に型を絞り込む"ことが強制される
let unknownValue: unknown = "hello";

// unknownValue.toUpperCase(); // ❌ Error: 絞り込みなしでは使用不可

// typeof演算子：値の型を実行時に文字列（"string"/"number"/"boolean"など）として判定する
// この判定結果をif文の条件にすることで、TypeScriptはブロック内の型を自動的に絞り込んでくれる（型ガード）
console.log(typeof "hello");  // "string"
console.log(typeof 100);      // "number"
console.log(typeof true);     // "boolean"

// typeof による型ガードで絞り込んでから使用する
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // ✅ ここではstring型として扱える
}

// 外部APIレスポンスなど「形が保証されない値」を受け取る関数の引数に最適
function processExternalData(data: unknown) {
  if (typeof data === "object" && data !== null && "id" in data) {
    console.log("IDを含むオブジェクトです");
  }
}

// never: 「絶対に発生しない・到達しない」ことを示す型
// 1. 必ず例外を投げる関数の戻り値
function throwError(message: string): never {
  throw new Error(message);
}

// 2. switch文の網羅性チェック（Exhaustiveness Check）に活用
type Status = "idle" | "loading" | "done";

function handleStatus(status: Status) {
  switch (status) {
    case "idle":
      return "待機中";
    case "loading":
      return "処理中";
    case "done":
      return "完了";
    default:
      // すべてのケースを処理済みなら、statusはnever型に絞り込まれるはず
      // 新しい状態が追加された際、ここで型エラーが発生し実装漏れに気づける
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}
`,
keyPoints: [
  "any: 型チェックを完全に放棄する。外部ライブラリに型定義がない場合などの最終手段としてのみ使用し、多用は厳禁",
  "unknown: anyと違い「使う前に型ガード（typeofやin演算子など）で絞り込む」ことがコンパイラに強制される、安全な『不明な型』の受け皿",
  "typeofは値の型を実行時に文字列として判定する演算子。if文の条件にtypeofチェックを置くことで、TypeScriptはそのブロック内での変数の型を自動的に絞り込む（型ガード）",
  "unknownは特に、fetchしたAPIレスポンスやJSON.parseの戻り値など『実行するまで形がわからない値』を扱う入り口に最適",
  "never: 『絶対に発生しない値・到達しないコード』を表す型。必ず例外を投げる関数の戻り値や、switch文の網羅性チェックに活用する",
  "any⇄unknownの選択に迷ったら、基本はunknownを選び、型ガードで安全に絞り込んでから使うのが定石",
],
},

// 4.
{
stepNumber: 4,
title: "オブジェクト型の詳細設計（readonly / optional / インデックスシグネチャ）",
explanation: "オブジェクトの「形」を定義する際、単純にプロパティと型を並べるだけでなく、'readonly'（読み取り専用）や '?'（オプショナル）といった修飾子、任意のキーを許容する「インデックスシグネチャ」を組み合わせることで、より実務に即した厳密なデータ構造を表現できます。",
codeExample:`interface Product {
  readonly id: string;       // 作成後に再代入不可（読み取り専用）
  name: string;
  price: number;
  description?: string;      // オプショナル：省略可能（値はstring | undefined）
  [key: string]: unknown;    // インデックスシグネチャ：任意の追加プロパティを許容
}

const item: Product = {
  id: "p001",
  name: "プロテイン",
  price: 3000,
  // descriptionは省略してもOK
};

// item.id = "p002"; // ❌ Error: readonlyプロパティは再代入不可

// オプショナルなプロパティはundefinedの可能性を考慮してアクセスする
console.log(item.description?.length ?? "説明文なし");

// インデックスシグネチャにより、定義していないキーの追加も型エラーにならない
item.stock = 50; // ✅ [key: string]: unknown により許容される
`,
keyPoints: [
  "readonlyは「オブジェクト初期化後の再代入を禁止する」修飾子。オブジェクト自体を完全に凍結するわけではない点に注意",
  "'?:' はプロパティの省略を許可する。アクセス時には必ずundefinedの可能性を考慮し、オプショナルチェイニング（?.）やNull合体演算子（??）と組み合わせる",
  "インデックスシグネチャ（[key: string]: T）は柔軟な反面、型安全性を弱める諸刃の剣。本当に必要な場合のみ使用し、多用は避ける",
  "実務では『必須プロパティは明示的に定義し、それ以外は極力インデックスシグネチャに頼らない』設計が推奨される",
],
},

// 5.
{
stepNumber: 5,
title: "関数の型定義（関数型・type・デフォルト引数・レスト引数）",
explanation: "関数そのものにも「引数の型と戻り値の型の組み合わせ」という型（関数型）が存在します。'type' を使ってこの関数型に名前をつけておくと、コールバック関数などを型として使い回せて可読性が向上します。あわせて、省略時のデフォルト値を設定する「デフォルト引数」、任意の個数の引数をまとめて受け取る「レスト引数（可変長引数）」の書き方も習得しましょう。",
codeExample:`// ① 関数型とは：「引数の型」と「戻り値の型」の組み合わせそのものを指す型
// (a: number, b: number) => number という部分が関数型
const multiplyInline: (a: number, b: number) => number = (a, b) => a * b;

// ② typeを使って関数型に名前をつける（Type Alias）
// 同じシグネチャの関数を複数箇所で使う場合、名前をつけておくと再利用性が上がる
type CalculateFn = (a: number, b: number) => number;

const add: CalculateFn = (a, b) => a + b;
const multiply: CalculateFn = (a, b) => a * b;

// コールバック関数の引数としても型を使い回せる
function runCalculation(a: number, b: number, calc: CalculateFn): number {
  return calc(a, b);
}

runCalculation(10, 5, add);      // 15
runCalculation(10, 5, multiply); // 50

// ③ デフォルト引数：呼び出し時に省略された場合の初期値を指定
// デフォルト値がある引数は、TypeScriptが自動的に「省略可能」と推論する
function greet(name: string, greeting: string = "こんにちは"): string {
  return \`\${greeting}、\${name}さん\`;
}

greet("太郎");             // "こんにちは、太郎さん"
greet("花子", "おはよう"); // "おはよう、花子さん"

// ④ レスト引数（可変長引数）：呼び出し時にいくつ渡されるかわからない引数をまとめて配列として受け取る
// "..." をつけた引数は必ず配列型として扱われる
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);       // 6
sum(10, 20, 30, 40); // 100
`,
keyPoints: [
  "関数型とは『引数の型』と『戻り値の型』の組み合わせそのものを指す型で、(a: number, b: number) => number のように矢印構文で表現する",
  "typeで関数型に名前をつけると、同じシグネチャの関数（コールバックなど）を型として使い回せ、可読性と保守性が向上する",
  "デフォルト引数（= 値）を設定すると、その引数はTypeScriptによって自動的に省略可能と推論される",
  "レスト引数（...変数名: 型[]）は『呼び出し時に個数が確定しない引数』を配列としてまとめて受け取る記法で、必ず配列型になる",
  "レスト引数は引数リストの最後に1つだけ配置できるというルールがある",
],
},

// 6.
{
stepNumber: 6,
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

];
