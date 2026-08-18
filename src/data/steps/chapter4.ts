// CHAPTER 4
// src/data/steps/chapter4.ts
import { StepContent } from "@/types/wizard";

export const CHAPTER_4_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "SSR / SSG / RSC の概念と違い",
explanation: "Next.jsの真骨頂は、用途に応じたレンダリング戦略の最適化です。静的ファイルをビルド時に作るSSG、リクエスト毎にサーバーで生成するSSR、そしてコンポーネント単位でサーバー処理とクライアントJS削減を両立するRSCの特性を理解しましょう。",
codeExample: `// 1. SSG (Static Site Generation): ビルド時にHTMLを事前生成（爆速）
// 2. SSR (Server-Side Rendering): リクエスト時にサーバーでリアルタイム描画
// 3. RSC (React Server Components): コンポーネントレベルでサーバー実行

// App Routerでは、動的関数の有無や fetch のキャッシュ設定で自動切り替えされる
export async function DynamicProfilePage() {
  // キャッシュなしの fetch -> 自動的に SSR 挙動を適用
  const res = await fetch("https://api.example.com/user", { cache: "no-store" });
  const user = await res.json();

  return <div>ようこそ、{user.name}さん！</div>;
}`,
keyPoints: [
  "SSG: ビルド時にHTML作成。1ページ毎に1枚のHTMLへ必要なコードをまとめる。表示速度が最速でCDNキャッシュに最適",
  "SSR: リクエスト毎にサーバーで生成。常に最新データが必要なページ向け",
  "RSC: コンポーネント単位でサーバー実行。バンドルサイズ激減の核心技術",
],
},

// 2.
{
stepNumber: 2,
title: "create-next-app による開発環境の自動構築",
explanation: "Next.js公式が提供する CLI ツール『create-next-app』を使うことで、TypeScript、Tailwind CSS、ESLint などの最新開発セットアップを一元かつ一瞬で完了させることができます。",
codeExample: `# ターミナルで対話型セットアップを実行！
npx create-next-app@latest my-app

# 実行時の推奨選択フォーム（プロの標準構成）：
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use \`src/\` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … Yes`,
keyPoints: [
  "コマンド1つで依存パッケージのインストールからビルド設定まで完了",
  "TypeScript と App Router を最初から有効化するのがモダン開発の基本フォーム",
],
},

// 3.
{
stepNumber: 3,
title: "create-next-app コマンドが自動で行う裏側の処理",
explanation: "このコマンドは単なるファイルコピーではありません。Next.js/Reactの依存関係解決、TypeScriptの設定（tsconfig.json）、PostCSS/Tailwindの設定、そして Next.js 独自のコンパイラ（Turbopack）のセットアップまでを全自動で最適化してくれます。",
codeExample: `my-app/
├── src/
│   └── app/               # App Router のルーティングルート
│       ├── layout.tsx     # 全体共通レイアウト（RSC）
│       ├── page.tsx       # トップページ（RSC）
│       └── globals.css    # グローバルスタイル
├── public/                # 静的ファイル（画像・ファビコン等）
├── next.config.ts         # Next.js 本体の設定ファイル
├── tsconfig.json          # TypeScriptコンパイラ設定
└── package.json           # 依存パッケージとビルドスクリプト`,
keyPoints: [
  "Turbopack が組み込まれ、開発サーバー（npm run dev）の起動とHMR（高速変更反映）が爆速化",
  "tsconfig.json やエイリアス（@/*）が最初から完璧にプリセットされる",
],
},

// 4.
{
stepNumber: 4,
title: "tsconfig.json の役割と設定項目の読み解き方",
explanation: "前のステップで生成された tsconfig.json は、TypeScriptコンパイラ（tsc）の動作を設定するファイルです。Next.jsが自動生成する内容をベースに、主要な設定項目の意味を読み解いていきましょう。特に strict モードを有効化する('strict: true')ことで、Null/Undefinedの未チェックや暗黙のany型を許さない、強力な型安全性を利用できます。",
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
      "noUnusedLocals": true,           /* 使われていないローカル変数をエラー化（strictとは別枠の設定） */
      "paths": {
        "@/*": ["./src/*"]              /* パスエイリアスの設定 */
      }
  }
}`,
keyPoints: [
  "target で変換先のJavaScriptバージョンを指定",
  "strict: true は有効化を推奨の設定。「基本的には有効化」をルールにしよう。なお strict: true だけで noImplicitAny と strictNullChecks も自動的に有効になる",
  "strictNullChecks により、予期せぬ Null Pointer エラーへの対策にも万全な体制を築こう",
  "プロジェクト規模に応じたパスエイリアス（@/）設定も便利。相対パス記述の混乱を激減させよう",
  "create-next-app で生成される tsconfig.json は既にベストプラクティスに近い設定になっているため、通常はゼロから書く必要はなく、意味を理解した上でプロジェクトに応じて微調整するのが実務的",
],
},

// 5.
{
stepNumber: 5,
title: "Next.js の App Router とディレクトリ構造",
explanation: "従来の Pages Router（/pages ディレクトリ）から進化し、'/app' ディレクトリ内のフォルダ階層がそのまま URL パスになる直感的なファイルシステムルーティングです。layout.tsx や loading.tsx などの特殊ファイルにより、堅牢な画面骨格を作れます。",
codeExample: `// src/app/dashboard/layout.tsx (ネストされた共通レイアウト)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside>🏋️ ダッシュボードナビ</aside>
      <main>{children}</main> {/* page.tsx がここに埋め込まれる */}
    </div>
  );
}`,
keyPoints: [
  "page.tsx: その階層の公開ページUIを定義",
  "layout.tsx: 状態を維持し、再レンダリングを防ぐ共通枠組み",
  "loading.tsx / error.tsx: 読み込み中やエラー時のフォールバックUIを自動差し替え",
],
},

// 6.
{
stepNumber: 6,
title: "Server Components (RSC) と Client Boundary の設計",
explanation: "App Routerの基本思想は『原則サーバー側で描画する』です。重いライブラリやDB直接アクセスのコードをサーバー側に閉じ込め、JSバンドルサイズをゼロに近づけます。onClickやuseStateなどのインタラクティブな処理が必要な末端のコンポーネントだけを 'use client' で切り離すのが定石です。より詳細な設計パターンやアンチパターンはChapter6で扱います。",
codeExample: `// 1. Server Component（デフォルト）
import { db } from "@/lib/db";
import { LikeButton } from "./LikeButton";

export async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await db.article.findUnique({ where: { id } });

  if (!article) return <div>記事が見つかりません</div>;

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <LikeButton initialLikes={article.likes} articleId={article.id} />
    </article>
  );
}`,
keyPoints: [
  "デフォルトは Server Component。セキュリティ向上と初期ロード速度の極限化を実現",
  "'use client' はコンポーネントツリーのなるべく『末端（葉）』に配置する",
],
},

// 7.
{
stepNumber: 7,
title: "Dynamic Routing と SearchParams の型定義",
explanation: "ファイルシステムベースルーティングにおいて、URLパラメーター（[id]）やクエリ文字列（?page=1）を TypeScript で型安全に受け取るテクニックです。Catch-all Routes（[...slug]）などのより複雑なパターンはChapter6で扱います。",
codeExample: `// app/products/[category]/[id]/page.tsx

interface PageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
  searchParams: Promise<{
    sort?: "asc" | "desc";
    page?: string;
  }>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { category, id } = await params;
  const { sort = "asc", page = "1" } = await searchParams;

  return (
    <div>
      <h2>カテゴリ: {category} / 商品ID: {id}</h2>
      <p>ソート順: {sort} | ページ: {page}</p>
    </div>
  );
}`,
keyPoints: [
  "Dynamic Routes のディレクトリ名がそのまま params オブジェクトのキーになる",
  "Next.js 15 以降の非同期型 params / searchParams の Promise 型定義に対応する",
],
},

// 8.
{
stepNumber: 8,
title: "Server Actions による型安全な Mutation 処理",
explanation: "従来のように REST API や fetch を自作・呼び出す必要なく、サーバー側で実行される関数をクライアントのフォームやイベントから直接呼び出せます。エラーハンドリングの応用パターンはChapter6で扱います。",
codeExample: `// app/actions/user.ts
"use server";

import { revalidatePath } from "next/cache";

export async function updateUsername(formData: FormData) {
  const username = formData.get("username") as string;

  if (!username || username.length < 3) {
    return { success: false, error: "名前は3文字以上にしてください" };
  }

  await db.user.update({ data: { name: username } });
  revalidatePath("/profile");

  return { success: true };
}`,
keyPoints: [
  "'use server' ディレクティブでファイルまたは関数を Server Action 化する",
  "revalidatePath で Next.js のフルルートキャッシュを即座に更新",
],
},

// 9.
{
stepNumber: 9,
title: "Streaming SSR と Route Handlers (Web API)",
explanation: "データ取得に時間がかかる処理を Suspense で部分ストリーミング配信（Streaming SSR）しつつ、外部連携用の REST API は Route Handlers (`route.ts`) で構築します。",
codeExample: `// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // API処理...
    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}`,
keyPoints: [
  "Suspense と Skeleton UI でレスポンス待機時間を体感的にゼロへ近づける",
  "route.ts 内で GET / POST / PUT などの関数を定義して Web API 化",
],
},
];
