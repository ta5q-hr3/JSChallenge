// CHAPTER 6
import { StepContent } from "@/types/wizard";

export const CHAPTER_6_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "RSC vs Client Components の設計戦略と境界線",
explanation: "Chapter4では、Server Components (RSC) がサーバー上で実行されバンドルサイズに含まれないこと、'use client' によってインタラクティブな処理をクライアント側に切り出せることの基本を学びました。ここでは一歩進んで、実際のプロジェクトで『どこまでをサーバー、どこからをクライアントにすべきか』という境界線の設計（Composition）の実践パターンを習得します。",
codeExample: `// ❌ 悪い例: ページ全体を 'use client' にしてしまう（バンドル肥大化）
// ⭕️ 良い例: データを取得するコンポーネント（RSC）の中で、ボタンなど必要な部分だけ Client Component 化する

// components/LikeButton.tsx
"use client";

import { useState } from "react";

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  return (
    <button onClick={() => setLikes((prev) => prev + 1)}>
      🏋️‍♂️ いいね! ({likes})
    </button>
  );
}

// app/posts/[id]/page.tsx (RSC - デフォルト)
import { prisma } from "@/lib/prisma";
import { LikeButton } from "@/components/LikeButton";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) return <div>記事が見つかりません</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* 末端（葉）のコンポーネントだけを Client 化！ */}
      <LikeButton initialLikes={post.likes} />
    </article>
  );
}`,
keyPoints: [
  "原則は RSC（Server Component）で作成し、必要最小限の末端コンポーネントのみ 'use client' を指定",
  "RSC から Client Component へ渡す Props は JSON シリアライズ（直列化）可能である必要がある",
  "機密情報（APIキーや直接のDBクエリ）は RSC 側に隠蔽してクライアントへ漏洩させない",
],
},

//2.
{
stepNumber: 2,
title: "実践的 Data Fetching と キャッシュ制御（Fetch & Cache）",
explanation: "App Router におけるデータ取得は、`fetch` や ORM (Prisma) を介して RSC 内で直接行います。Next.js の拡張されたキャッシュ機構（Data Cache / Full Route Cache）を理解し、手動でキャッシュを破棄（revalidatePath / revalidateTag）するパターンをマスターします。",
codeExample: `import { revalidateTag } from "next/cache";

// 1. 静的キャッシュ（SSG 的挙動: デフォルト）
// → fetchの結果をビルド時に取得しキャッシュに保存する。
//   以降のリクエストは再取得せずキャッシュを返し続けるため、更新頻度の低いコンテンツ（会社概要、規約ページなど）に向いています
async function getStaticData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

// 2. 時間ベースの再検証（ISR 的挙動: 60秒ごとに更新）
//   * ISR : ISR (Incremental Static Regeneration) は、Next.js のページ生成手法の一つです。ビルド時に生成される静的ページの一部を動的に更新できる仕組みです。ページのリクエストが発生する度に、バックグラウンドで指定した期限が切れたページを新しいものに差し替えることで、静的サイトのパフォーマンスを維持しつつ、最新のコンテンツを提供します。
// → キャッシュは使いつつも、指定した秒数（ここでは60秒）が経過した後の最初のアクセス時にバックグラウンドで再取得する。
//   「多少の遅延は許容できるが、ある程度は最新のデータを見せたい」場合...ダッシュボードやランキング表示などに向いています
async function getRevalidatedData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 60, tags: ["dashboard-data"] },
  });
  return res.json();
}

// 3. キャッシュなし（SSR 的挙動: リクエスト毎にリアルタイム取得）
// → キャッシュを使わず、アクセスのたびに毎回サーバーから再取得します。
//   在庫数や口座残高など「常に最新であること」が必須なデータに向いています（※その分サーバー負荷は高くなります）
async function getDynamicData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store",
  });
  return res.json();
}

// 4. Server Action で任意のタイミングにタグ単位でキャッシュ破棄！
// → 上記2番の「60秒待つ」のような時間経過を待たず、ユーザーの操作（保存ボタン押下など）をきっかけに即座にキャッシュを無効化したい場合に使います。
//   同じtagsを指定したfetch（この例では2番）のキャッシュだけをピンポイントで破棄できます
export async function refreshDashboard() {
  "use server";
  revalidateTag("dashboard-data");
}`,
keyPoints: [
  "用途に応じて `cache: 'no-store'`（リアルタイム）と `next: { revalidate: N }`（定期的更新）を使い分ける",
  "タグ（`next: { tags: [...] }`）を付与することで、特定のデータ変更時のみピンポイントでキャッシュをパージ可能",
],
},

// 3.
{
stepNumber: 3,
title: "Server Actions の型安全なエラーハンドリングと UI 連携",
explanation:
  "Server Actions でのバリデーションエラーや DB エラーをクライアントへ安全に返し、`useActionState` や `useTransition` を使ってローディング表示やエラーメッセージ描画を型安全に行うプロのテクニックです。",
codeExample: `// app/actions/user.ts
"use server";

export type FormState = {
  success: boolean;
  message?: string;
  errors?: { name?: string[] };
};

export async function createUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get("name") as string;

  if (!name || name.length < 3) {
    return {
      success: false,
      message: "入力内容に不備があります",
      errors: { name: ["名前は3文字以上で入力してください"] },
    };
  }

  // DB保存処理など...
  return { success: true, message: "ユーザーを作成しました！" };
}

// components/UserForm.tsx (Client Component)
"use client";

import { useActionState } from "react";
import { createUserAction, FormState } from "@/app/actions/user";

const initialState: FormState = { success: false };

export function UserForm() {
  const [state, formAction, isPending] = useActionState(createUserAction, initialState);

  return (
    <form action={formAction}>
      <input type="text" name="name" placeholder="名前を入力" disabled={isPending} />
      {state.errors?.name && <p className="error">{state.errors.name[0]}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "送信中..." : "登録"}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}`,
keyPoints: [
  "React 19 / Next.js の `useActionState` を使ってフォーム送信Stateとローディング状態（isPending）を一元管理",
  "例外（throw）を投げるのではなく、型のついたエラーオブジェクトを返却して UI 側でハンドリングする",
],
},

// 4.
{
stepNumber: 4,
title: "Catch-all Routes によるパラメーター処理の実践パターン",
explanation:
  "Chapter4では `[category]/[id]` のようなネストされた基本的な Dynamic Routing を学びました。ここでは一歩進んで、任意の深さのパスセグメントをまとめて受け取る Catch-all Routes（`[...slug]`）を活用し、より複雑な URL 構造から型安全にパラメーターを抽出してデータ取得へ接続するパターンを習得します。",
codeExample: `// app/shop/[...slug]/page.tsx
// URL例: /shop/clothes/tops/t-shirt

interface ShopPageProps {
  params: Promise<{
    slug: string[]; // 配列として受け取る: ["clothes", "tops", "t-shirt"]
  }>;
  searchParams: Promise<{
    size?: string;
    color?: string;
  }>;
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { slug } = await params;
  const { size, color } = await searchParams;

  const categoryPath = slug.join(" > ");

  return (
    <div>
      <h1>カテゴリ階層: {categoryPath}</h1>
      <p>フィルタ: サイズ={size ?? "すべて"}, カラー={color ?? "すべて"}</p>
    </div>
  );
}`,
keyPoints: [
  "`[...slug]` (Catch-all) や `[[...slug]]` (Optional Catch-all) を使いこなすことで柔軟な階層構造に対応",
  "通常の `[id]` 形式（Chapter4参照）とは異なり、slug は必ず文字列の配列として受け取る点に注意",
  "Next.js 15 仕様に則り `params` と `searchParams` は Promise として `await` 処理する",
],
},

// 5.
{
stepNumber: 5,
title: "next/image による画像最適化と LCP (Web Vitals) 対策",
explanation: "Next.js の `<Image />` コンポーネントは、ブラウザに応じた次世代フォーマット（WebP/AVIF）への自動変換、リサイズ、Lazy Loading（遅延読み込み）を自動で行います。ファーストビューの画像の LCP を最大化する設定も習得します。",
codeExample: `import Image from "next/image";
import heroImg from "@/public/hero.jpg"; // ローカル画像はインポートで幅・高さを自動計算

export function HeroSection() {
  return (
    <section>
      {/* 1. ローカル画像の基本表示 */}
      <Image src={heroImg} alt="ヒーロー画像" placeholder="blur" />

      {/* 2. リモート（外部URL）画像の最適化 ＆ LCP 対策 */}
      <div style={{ position: "relative", width: "100%", height: "400px" }}>
        <Image
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd"
          alt="ジムトレーニング"
          fill // 親要素いっぱいに広げる
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // レスポンシブ最適化
          priority // ファーストビュー画像に優先読み込み（LCP爆速化！）
          className="object-cover"
        />
      </div>
    </section>
  );
}`,
keyPoints: [
  "ファーストビューに位置する重要画像には `priority` を付与し、遅延読み込みを解除して LCP を高速化",
  "外部ドメインの画像を使用する場合は `next.config.ts` の `images.remotePatterns` にドメイン許可設定が必要",
  "`fill` プロパティを使う際は、親要素に `position: relative` や `height` の指定が必須",
],
},

];
