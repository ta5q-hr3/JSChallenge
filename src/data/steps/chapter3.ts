// CHAPTER 3
import { StepContent } from "@/types/wizard";

export const CHAPTER_3_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "JSX / TSX と Virtual DOM の仕組み",
explanation: "Reactは JavaScript/TypeScript の中で HTML のような構文を書く『JSX/TSX』を採用しています。Reactは状態変更時にいきなり実際のDOMを書き換えるのではなく、メモリ上の『仮想DOM（Virtual DOM）』で差分（Diffing）を計算し、必要な部分だけを最小限の負荷でリアルDOMへ反映（Reconciliation）します。",
codeExample: `// TSX では、React 要素の型は React.JSX.Element（または React.ReactNode）となる
import React from "react";

interface GreetingProps {
  name: string;
  isTrainer?: boolean;
}

// 書き方①: React.FC<Props> を使う（従来よく使われてきた書き方）
export const Greeting: React.FC<GreetingProps> = ({ name, isTrainer = false }) => {
  return (
    <div className="card">
      <h3>オッス、{name}！</h3>
      {isTrainer && <p>本日も限界まで追い込みましょう!</p>}
    </div>
  );
};

// 書き方②: 関数の引数に直接Props型を注釈する（近年推奨されることが多い書き方）
// React.FC は「暗黙的に children を受け取れてしまう」「Genericsなコンポーネントと相性が悪い」
// といった理由から、最近はこちらのシンプルな書き方が広く使われる傾向にある
export function GreetingAlt({ name, isTrainer = false }: GreetingProps) {
  return (
    <div className="card">
      <h3>オッス、{name}！</h3>
      {isTrainer && <p>本日も限界まで追い込みましょう!</p>}
    </div>
  );
}`,
keyPoints: [
  "TSX ファイルでは HTML 風の記法と TypeScript の型演算をスムーズに融合できる",
  "仮想DOMの差分検出により、DOM操作のオーバーヘッドを劇的に削減",
  "条件付きレンダリング（&& や三項演算子）でも型チェックが厳格に機能する",
  "React.FC<Props> と「関数の引数に直接Props型を注釈する」書き方の2通りがある。どちらも間違いではないが、近年は後者（React.FCを使わない書き方）が推奨されることが多い",
],
},

// 2.
{
stepNumber: 2,
title: "Props と State の厳格な型定義",
explanation: "useStateは、Reactコンポーネントに「値の変化を検知して再描画する」状態(State)を持たせるための最も基本的なフックです。呼び出すと [現在の値, 値を更新する関数] という2つの要素を持つ配列が返り、これを分割代入で受け取って使います。更新用の関数を呼ぶとコンポーネントが再レンダリングされ、画面上の表示も自動的に最新の値へ更新されます。Reactコンポーネントの基本は『外部から渡される Props（読み取り専用）』と『内部で保持・変化する State（状態）』です。Props に Interface を定義し、useState にジェネリクス（<T>）を与えることで、データフロー全体の型不整合を完全にシャットアウトします。",
codeExample: `import { useState } from "react";

/*
 ** useStateについて **
// useStateの基本形：[現在の値, 値を更新する関数] という配列が返る
const [isVisible, setIsVisible] = useState(false);
// isVisible    : 現在の状態（この時点では false）
// setIsVisible : isVisible を更新するための関数

// setIsVisible(true) を実行すると、
// 1. isVisible の値が true に更新される
// 2. このコンポーネントが再レンダリングされる
// 3. 再レンダリング後、isVisible は新しい値(true)として参照できる
 */

/*
 ** useState<T>(初期値) **
// useState<T>(初期値) の意味を分解すると：
// <T>     : この状態(State)が保持する値の「型」を明示的に指定する部分
// (初期値) : Stateの初期値。型注釈と矛盾する値を渡すとコンパイルエラーになる

// 例1: number型であることを明示
const [count, setCount] = useState<number>(initialCount);
// → count は number型として扱われる
// → setCount(1) はOK、setCount("1") は型エラーになる

// 例2: 型注釈を省略した場合、TypeScriptは初期値から自動で型推論する
const [count2, setCount2] = useState(0);
// → 初期値が 0 (number) なので、count2 は自動的に number型と推論される
// → 単純な初期値の場合、<T> を省略しても実用上ほぼ同じ結果になる

// 例3: 明示的な型指定が「必須」になるケース
// 初期値が null の場合、型注釈が無いと型が null 型のまま固定されてしまい、
// 後から別の型の値を代入しようとするとエラーになってしまう
const [user, setUser] = useState<UserProfile | null>(null);
// → user は「UserProfile型 または null」として扱われる
// → setUser({ id: "usr_001", name: "Taro" }) も setUser(null) もどちらも可能
// ** つまり、nullが想定される値にuseStateを使用する場合はuseSate<T>()で型を指定する必要がある **
 */

// 1. Props の型定義（関数の引数と同じフォーム）
interface CounterProps {
  initialCount?: number;
  label: string;
}

// 2. 複雑な State の型定義（Union 型の活用）
type UserStatus = "active" | "resting" | "exhausted";

// 3. 非同期取得前は値が存在しない、といったケースの型定義
interface UserProfile {
  id: string;
  name: string;
}

export function MuscleCounter({ initialCount = 0, label }: CounterProps) {
  const [count, setCount] = useState<number>(initialCount);
  const [status, setStatus] = useState<UserStatus>("active");

  // 初期値が null の可能性がある場合は Generics で明示！
  // 「UserProfile型 または null」という Union 型を useState に渡す
  const [user, setUser] = useState<UserProfile | null>(null);

  // 疑似的な非同期取得 (非同期処理したように見えるだけ。実際は useEffect + fetch などを利用する)
  const handleLoadUser = () => {
    setUser({ id: "usr_001", name: "Taro" });
  };

  return (
    <div>
      <h4>{label}: {count} レップ</h4>
      <p>現在の状態: {status}</p>
      {/* user が null の可能性があるため、参照前に必ずチェックが必要になる */}
      <p>ユーザー: {user ? user.name : "未取得"}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>＋1 レップ</button>
      <button onClick={() => setStatus("exhausted")}>限界突破（All Out）</button>
      <button onClick={handleLoadUser}>ユーザー情報を取得</button>
    </div>
  );
}`,
keyPoints: [
  "useStateは[現在の値, 更新用関数]という配列を返す。更新関数を呼ぶと再レンダリングがトリガーされ、画面が最新の値に同期される",
  "useState<T>のTは「Stateが保持する値の型」を指定するもので、以降そのStateに代入できる値の型を制限する",
  "Props は読み取り専用（Immutable）。受け取る側で Interface を定義して契約を結ぶ",
  "useState<T> で初期値から型が推論されるが、null を許容する場合などは明示的に Generics を渡す (初期値だけで型が一意に決まらない場合(特にnullを初期値にする場合)は、<T>の明示が実質的に必須になる)",
  "useState<UserProfile | null>(null) のように「型 | null」を渡すと、『まだ値が無いかもしれない状態』を型で安全に表現できる。この場合、TypeScriptは使用前にnullチェックを行うことを促してくれる",
],
},

// 3.
{
stepNumber: 3,
title: "TypeScript と React Hooks（useEffect / useRef）",
explanation: "副作用を扱う useEffect や、DOM要素への直接参照・レンダリングをトリガーしない値の保持を行う useRef など、標準Hooksと TypeScript の組み合わせ方をマスターします。",
codeExample: `import { useEffect, useRef, useState } from "react";

export function TimerComponent() {
  const [seconds, setSeconds] = useState<number>(0);
  
  // HTML要素を参照する場合：ジェネリクスに具体的な HTML エレメント型を指定
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 画面マウント時に input へフォーカス
    inputRef.current?.focus();

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // クリーンアップ関数（タイマー解除）でメモリリークをガード！
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="メモを入力..." />
      <p>経過時間: {seconds} 秒</p>
    </div>
  );
}`,
keyPoints: [
  "useRef<HTMLInputElement>(null) のように、参照する DOM の型を明示する",
  "useEffect のオプショナルな戻り値（クリーンアップ関数）で非同期処理やイベントリスナーの後始末を行う",
],
},

// 4.
{
stepNumber: 4,
title: "【実践】イベントハンドラーと Form の型注釈",
explanation: "ユーザーの入力 (input) やフォーム送信 (submit) イベントの型を正確につけることで、イベントオブジェクト（e）の補完機能がフルに働き、安全なイベントハンドリングが可能になります。",
codeExample: `import React, { useState } from "react";

export function MuscleForm() {
  const [text, setText] = useState<string>("");

  // onChange イベントの型注釈：React.ChangeEvent<HTMLInputElement>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // onSubmit イベントの型注釈：React.FormEvent<HTMLFormElement>
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ページリロードを停止
    alert(\`登録完了: \${text}\`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={handleChange} />
      <button type="submit">送信</button>
    </form>
  );
}`,
keyPoints: [
  "React.ChangeEvent<HTMLInputElement> など、どの HTML 要素のイベントかジェネリクスで指定",
  "インライン関数なら自動推論されるが、関数を分離して定義する場合は明示的な型注釈が必須",
],
},

// 5.
{
stepNumber: 5,
title: "【実践】Custom Hooks によるロジックの抽出と型設計",
explanation: "コンポーネントの中に記述しがちな状態管理や非同期通信を Custom Hook として切り出します。戻り値を配列で返す場合は 'as const' を使って型をタプルとして確定させるのがプロのテクニックです。",
codeExample: `import { useState } from "react";

// カスタムフック：トグル状態を管理する汎用ロジック
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = () => setValue((prev) => !prev);

  // as const を使わないと (boolean | (() => void))[] の配列型と推論されてしまう！
  // as const を使うことで [boolean, () => void] のタプル型に固定！
  return [value, toggle] as const;
}

// 利用側のコンポーネント
export function ModalComponent() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>
        {isOpen ? "モーダルを閉じる" : "モーダルを開く"}
      </button>
      {isOpen && <div className="modal">💪 限界突破モーダル！</div>}
    </div>
  );
}`,
keyPoints: [
  "useから始まる関数を作成し、React Hook のルールに従って状態ロジックをカプセル化",
  "タプル形式で配列を返すカスタムフックには 'as const' を付与して厳密な型推論を保つ",
],
},

];
