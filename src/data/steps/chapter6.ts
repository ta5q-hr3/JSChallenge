// CHAPTER6
import { StepContent } from "@/types/wizard";

export const CHAPTER_6_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "RSC vs Client Components の設計戦略と境界線",
explanation: "React Server Components (RSC) はサーバー上で実行され、HTML/JSONとしてレンダリングされます。JSバンドルサイズに含まれないため爆速です。一方、Client Components ('use client') はブラウザ側でインタラクティブな操作や状態（useState/useEffect）を扱うためのものです。適切な分離（Composition）がアプリのパフォーマンスを左右します。",
codeExample: `// ❌ 悪い例: ページ全体を 'use client' にしてしまう（バンドル肥大化）
// ⭕️ 良い例: データを取得するコンポーネント（RSC）の中で、ボタンなど必要な部分だけ Client Component 化する

// components/LikeButton.tsx
"use client";

import { useState } from "react";

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  return (
    <button onClick={() => setLikes((prev) => prev + 1)}>
      🏋️‍♂️ いいね！ ({likes})
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
async function getStaticData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

// 2. 時間ベースの再検証（ISR 的挙動: 60秒ごとに更新）
async function getRevalidatedData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 60, tags: ["dashboard-data"] },
  });
  return res.json();
}

// 3. キャッシュなし（SSR 的挙動: リクエスト毎にリアルタイム取得）
async function getDynamicData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store",
  });
  return res.json();
}

// Server Action で任意のタイミングにタグ単位でキャッシュ破棄！
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
title: "Dynamic Routing とパラメーター処理の実践パターン",
explanation:
  "ネストされた Dynamic Routing（`[category]/[id]`）や Catch-all Routes（`[...slug]`）を活用し、複雑な URL 構造から型安全にパラメーターを抽出してデータ取得へ接続します。",
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

