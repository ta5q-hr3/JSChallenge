// CHAPTER 2
import { StepContent } from "@/types/wizard";

export const CHAPTER_2_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "Interface & Type Alias の基礎と使い分け",
explanation: "Chapter1では type によるシンプルな型エイリアスの定義に軽く触れました。ここからは、オブジェクトの「形」を定義するための2大ツールである Interface と Type Alias を本格的に比較していきます。拡張性（extends / 宣言の自動結合）に優れた Interface と、Union型やプリミティブ型などあらゆる型に名前をつけられる Type Alias の特徴を理解し、チームで一貫した記法を保ちましょう。",
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
};

// 3. 同名の再宣言における挙動の違い
interface Animal {
  name: string;
}
interface Animal {
  age: number;
}
// ↑ Interfaceは同名で複数宣言すると自動でマージされる（Declaration Merging）
// 結果的に Animal は { name: string; age: number } として扱われる

// type PetAnimal = { name: string };
// type PetAnimal = { age: number }; // ❌ Error: 同名のTypeAliasは再宣言できない
`,
keyPoints: [
  "オブジェクトやクラスの設計には Interface を優先して拡張性を確保",
  "Union型・Tuple・関数の型シグネチャ・組み換えには Type Alias が圧倒的に優位",
  "Interface は同名で複数宣言すると自動で結合（Declaration Merging）されるが、Type Alias は同名の再宣言自体がコンパイルエラーになる点が明確な違い",
],
},

// 2.
{
stepNumber: 2,
title: "Generics（抽象型）で再利用性を極限まで高める",
explanation: "型を引数のように外部から受け取ることで、コードの再利用性と型安全性を完璧に両立させるテクニックです。APIレスポンスの共通ラッパーや汎用コンポーネントの構築に欠かせません。さらに 'extends' を使うことで、受け取れる型に制約をかけることも可能です。",
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

// ApiResponse<UserData> とすることで、T の部分に UserData が当てはめられる
// つまり UserResponse は { data: UserData; status: number; message: string } と同じ意味になる
type UserResponse = ApiResponse<UserData>;

// 実際に値を作って data の中身を取り出してみる
const response: UserResponse = {
  data: { userId: 1, username: "taro" }, // data には UserData型の値が入る
  status: 200,
  message: "OK",
};

console.log(response.data.userId);   // 1 （UserData の userId として型補完・型チェックが効く）
console.log(response.data.username); // "taro"

// --- ここから Generics を持つ関数の例 ---

// ① まずは最もシンプルな Generics 関数
// <T> の部分：この関数が「どんな型でも受け取れる」ことを宣言している
// (item: T)：引数 item の型は、呼び出し時に決まる T 型
// : T[]     ：戻り値は「T型の配列」になる、という意味
function wrapInArray<T>(item: T): T[] {
  return [item]; // 受け取った値を配列に入れて返すだけ
}

const numberArray = wrapInArray(100);     // 100(number) を渡したので T は number に確定 → number[]
const stringArray = wrapInArray("hello"); // "hello"(string) を渡したので T は string に確定 → string[]

// ② extends を使って「受け取れる型」に制約をかける例
// T は必ず id プロパティを持つ型でなければならない、という制約
interface HasId {
  id: string | number;
}

// <T extends HasId>  ：T は HasId の形（idプロパティ）を持つ型に限定する、という制約
// (items: T[], id: T["id"]) ：T型の配列と、T型が持つidと同じ型のid値を受け取る
// : T | undefined     ：見つかればT型の要素、見つからなければundefinedを返す
function findById<T extends HasId>(items: T[], id: T["id"]): T | undefined {
  // 配列の中から、idが一致する要素を1つ探して返す（Array.prototype.find を利用）
  return items.find((item) => item.id === id);
}

// --- 制約付きGenericsの動作確認 ---

// UserData には id プロパティが無いため、HasId の制約を満たさない
// そのため findById(users, ...) のようには使えない（コンパイルエラーになる）
const users: UserData[] = [];

// 制約を満たす型を用意する：HasId を継承して id プロパティを持たせる
interface Product extends HasId {
  name: string;
}

const products: Product[] = [
  { id: "p001", name: "プロテイン" },
  { id: "p002", name: "シェイカー" },
];

// Product は HasId の制約（idを持つ）を満たしているので findById が使える
const found = findById(products, "p001"); // ✅ Product | undefined 型として返る
console.log(found?.name); // "プロテイン"
`,
keyPoints: [
  "Generics を使うことで 'any 型' に逃げずに柔軟な汎用処理が書ける",
  "ApiResponse<UserData> のように型引数を指定すると、interface内の T が実際の型（ここではUserData）に置き換わる。取り出す際は response.data.userId のように、普段のオブジェクトと同じ感覚でアクセスできる",
  "'<T extends CustomType>' のように extends を使うことで受け取れる型に制約をかけられる",
  "制約付きGenericsを使うと、'T型はidプロパティを持つ' といった最低限の形を保証しつつ、具体的な型は呼び出し側に委ねられる",
],
},

// 3.
{
stepNumber: 3,
title: "Utility Types (Pick / Omit) による型の再利用",
explanation: "既存の大きな型から、必要なプロパティだけを「抽出（Pick）」したり「除外（Omit）」したりして新しい型を作り出します。元の型に加えられた変更も適用されるため重複コードを撲滅し、元データの変更に強い設計を実現します。",
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
title: "Utility Types (Partial / Required) による柔軟な型変換",
explanation: "Pick / Omit がプロパティの「取捨選択」だったのに対し、Partial と Required はプロパティの「必須・任意」を一括で反転させるユーティリティ型です。フォームの入力途中の状態や、更新APIの部分更新（PATCH）などを表現する際に頻出します。",
codeExample: `interface UserSettings {
  displayName: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
}

// 更新前の元データ（すべての項目が揃っている状態）
const currentSettings: UserSettings = {
  displayName: "Taro",
  theme: "light",
  notificationsEnabled: true,
};

// 更新APIでは「変更したい項目だけ」を受け取りたい -> Partial ですべて任意化
type UpdateUserSettingsInput = Partial<UserSettings>;

// patchには一部のプロパティだけが渡される想定（他は undefined になる）
function updateSettings(current: UserSettings, patch: UpdateUserSettingsInput): UserSettings {
  // スプレッド構文で「元の値」に「渡された差分」を上書きマージする
  return { ...current, ...patch };
}

// theme だけを変更したい場合、他のプロパティを渡す必要がない
const updated = updateSettings(currentSettings, { theme: "dark" });
console.log(updated);
// { displayName: "Taro", theme: "dark", notificationsEnabled: true } ← themeだけが変わっている

// もし Partial を使わず UserSettings のままだと、
// 以下のように全プロパティを毎回渡さないと型エラーになってしまう（Partialの効果がわかる比較）
// function updateSettingsWithoutPartial(current: UserSettings, patch: UserSettings) { ... }
// updateSettingsWithoutPartial(currentSettings, { theme: "dark" }); // ❌ Error: 他のプロパティも必須

// --- Required の例 ---

// フォーム入力中は一部項目が未入力（任意）であることを許容したい
interface DraftProfile {
  name?: string;
  email?: string;
}

// 送信直前には「全項目が入力済み」であることを型で保証したい -> Required ですべて必須化
type CompletedProfile = Required<DraftProfile>;

function submitProfile(profile: CompletedProfile) {
  // Required化されているため、name・email が undefined である心配なく利用できる
  console.log(\`\${profile.name} 様（\${profile.email}）の登録を受け付けました\`);
}

const draft: DraftProfile = { name: "Hanako" }; // email が未入力の下書き状態

// submitProfile(draft); // ❌ Error: DraftProfileはemailがoptionalなため、CompletedProfileの制約を満たさない

const completed: CompletedProfile = { name: "Hanako", email: "hanako@example.com" };
submitProfile(completed); // ✅ 全項目が揃っているため呼び出せる
`,
keyPoints: [
  "Partial<T>: T の全プロパティを「オプショナル（省略可能）」に変換する。PATCH更新やフォームの中間状態の表現に最適",
  "上記のように、Partialを使わない場合は更新関数を呼ぶたびに全プロパティを渡す必要があり、Partialを使うことで「差分だけ渡す」設計が型安全に実現できる",
  "Required<T>: T の全プロパティを「必須」に変換する。オプショナルなプロパティを持つ型から『完全に入力済み』な状態を型で保証したい場合に使う",
  "Required化された型を引数にすることで、『未入力の項目がある状態のオブジェクト』を関数にそのまま渡そうとするとコンパイルエラーで検知できる",
  "Pick/Omitが『プロパティの取捨選択』であるのに対し、Partial/Requiredは『必須・任意の一括変換』という役割の違いを意識する",
],
},

// 5.
{
stepNumber: 5,
title: "【応用】Discriminated Unions & as const",
explanation: "共通の識別子（tag）を持たせることで型の分岐を100%安全にする Discriminated Unions と、オブジェクトを完全な読み取り専用＆リテラル型化する 'as const' をマスターすれば、TypeScriptの本当の深淵に到達できます。",
codeExample: `// as const でオブジェクトの値を変更不可＆リテラル型化！
const CONFIG = {
  API_ENDPOINT: "https://api.example.com",
  MAX_RETRIES: 3,
} as const;

// as const は配列にも使用可能：readonly なタプル型として扱われる
const SUPPORTED_LOCALES = ["ja", "en", "zh"] as const;
// 型は readonly ["ja", "en", "zh"] となり、要素の追加・変更ができなくなる
// SUPPORTED_LOCALES.push("fr"); // ❌ Error: readonly配列にpushはできない

type Locale = (typeof SUPPORTED_LOCALES)[number]; // "ja" | "en" | "zh" というUnion型を生成できる

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
  "as const は配列にも適用でき、readonly なタプル型として要素の変更・追加を禁止できる。'(typeof 配列)[number]' と組み合わせるとUnion型を自動生成できる",
  "Discriminated Unions により、if や switch で条件分岐した際に型が完全に絞り込まれる（Type Narrowing）",
],
},

];
