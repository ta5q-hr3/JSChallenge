// CHAPTER 7
import { StepContent } from "@/types/wizard";

export const CHAPTER_7_STEPS: StepContent[] = [
// 1.
{
stepNumber: 1,
title: "Auth.js (NextAuth.js v5) による型安全な認証基盤",
explanation:
  "Next.js App Router に完全対応した Auth.js (NextAuth.js v5) を導入します。OAuthプロバイダー（GitHub/Googleなど）や Credentials 認証をサポートし、セッションデータに TypeScript の型注釈（Session Callback）を付与して厳格に管理します。",
codeExample: `// auth.ts (App Router 互換のルート設定)
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Prisma と連携してセッションやユーザーを DB 保存
  providers: [GitHub],
  callbacks: {
    // セッションオブジェクトに custom ユーザー ID やロール型を追加！
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; // 型定義拡張と組み合わせて利用
      }
      return session;
    },
    // session コールバックは、Auth.js(認証機能を構成するコード) が「セッション情報を生成・更新するタイミング」で
    // ライブラリ側から自動的に呼び出される関数です。（※ 自分でsession/userを用意する必要はありません）
    // 第一引数のオブジェクトから { session, user } を分割代入で受け取っている：
    //   - session: これまでの標準的なセッション情報（有効期限やデフォルトのuser情報など）
    //   - user: PrismaAdapter が DB（Userテーブル）から取得した、ログイン中のユーザー情報
    // つまりこのcallbaksに書かれたsession関数は「DBのユーザー情報(user)を、クライアントに返すセッション(session)に合成する」役割を持ちます
  },
});`,
keyPoints: [
  "PrismaAdapter を使用することで、ログインしたユーザー情報を自動的に DB へ同期・保存",
  "TypeScript の Module Augmentation（`next-auth` の型拡張）を用いて session.user の型を独自強化",
  "Server Components 内では `const session = await auth()` だけで超高速に認証状態を取得可能",
],
},

// 2.
{
stepNumber: 2,
title: "Middleware による認証ガードとルート保護",
explanation:
  "特定のエンドポイント（`/dashboard/*` や `/admin/*` など）へのアクセスを、ページを描画する前の Edge / Server 層（Middleware）でインターセプトして型安全に保護します。",
codeExample: `// middleware.ts (プロジェクト直下に配置)
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard && !isLoggedIn) {
    // 未ログインユーザーをログインページへ強制リダイレクト！
    return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl));
  }

  return NextResponse.next();
});

// Middleware を適用するパスを正規表現でガード！
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};`,
keyPoints: [
  "Middleware を使うことで、クライアント側でのリダイレクトチラつき（Flicker）をゼロにする",
  "Matcher 設定で保護対象のルートを明確に絞り込み、サーバー負荷と無駄な実行を低減",
],
},

// 3.
{
stepNumber: 3,
title: "Web セキュリティの防壁（CSRF, XSS, CSP, CORS）と Zod によるバリデーション",
explanation:
  "Webアプリケーションの脆弱性を防ぐための必須テクニックです。入力データの改ざんや不正スクリプト実行（XSS）を防ぐため、Zod スキーマによるサーバー側の厳格な型検証を徹底します。あわせて、CSRF・CSP・CORSといった代表的な防御の仕組みについても概念を理解しておきましょう。",
codeExample: `import { z } from "zod";

// Zodで利用できる代表的なバリデーションプロパティ（一例）
// z.string()                 : 文字列であることを検証
// z.number()                 : 数値であることを検証
// z.boolean()                : 真偽値であることを検証
// .email()                   : メールアドレス形式かを検証
// .url()                     : URL形式かを検証
// .min(n) / .max(n)          : 文字列の最小/最大文字数、数値の最小/最大値を検証
// .optional()                : そのプロパティの省略（undefined）を許可
// .nullable()                : null値を許可
// .default(value)            : 値が無い場合のデフォルト値を設定
// .array()                   : 配列であることを検証（例: z.string().array()）
// z.enum([...])              : 決まった文字列リストのいずれかであることを検証
// .refine(fn, message)       : 独自の検証ロジック（パスワード確認一致など）を追加

// 入力値の型ガード＆バリデーションスキーマ定義
const RegisterSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(8, { message: "パスワードは8文字以上必須です" }),
  age: z.number().min(18, { message: "18歳以上である必要があります" }),
});

export async function registerUserAction(rawData: unknown) {
  // safeParse を使って例外を出さずに型検証！
  const result = RegisterSchema.safeParse(rawData);

  if (!result.success) {
    // 型安全にエラー詳細を取得して返す
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // 検証成功！ result.data は完全に型安全なオブジェクトになる
  const { email, password } = result.data;
  // ...DB保存等の処理
}

// --- CSP(Content Security Policy) ヘッダーの設定例（next.config.ts）---
/* 
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self';", // 自ドメイン以外のスクリプト実行を禁止
          },
        ],
      },
    ];
  },
};
*/

// --- CORS(Cross-Origin Resource Sharing) ヘッダーの設定例（Route Handler）---
/*
export async function GET(request: Request) {
  return NextResponse.json(
    { data: "..." },
    { headers: { "Access-Control-Allow-Origin": "https://trusted-site.com" } } // 許可するオリジンを限定
  );
}
*/
`,
keyPoints: [
  "Zod は「型を定義しながら、その型に対応する実行時バリデーションも同時に行える」ライブラリ。string/number/booleanなどの基本型に加え、email・url・min/maxといった具体的な検証ルールをメソッドチェーンで柔軟に組み合わせられる",
  "CSRF（Cross-Site Request Forgery / クロスサイトリクエストフォージェリ）: 悪意あるサイトが利用者になりすまして意図しないリクエストを送信させる攻撃。Cookieへの SameSite 属性付与に加え、Next.jsのServer Actionsはデフォルトで送信元Originを検証し、他サイトからの不正なフォーム送信を自動的にブロックする仕組みを持つ",
  "XSS（Cross-Site Scripting / クロスサイトスクリプティング）: Webページに悪意あるスクリプトを埋め込み、他の利用者のブラウザ上で実行させる攻撃。React/Next.js は標準で XSS エスケープを行うが、`dangerouslySetInnerHTML` の安易な使用は厳禁",
  "CSP（Content Security Policy / コンテンツセキュリティポリシー）: `Content-Security-Policy` ヘッダーで「読み込み・実行を許可するスクリプトや外部リソースの取得元」を制限し、XSSなどによる不正スクリプト注入の被害を軽減する仕組み。`next.config.ts` の `headers()` で設定できる",
  "CORS（Cross-Origin Resource Sharing / オリジン間リソース共有）: 異なるオリジン（ドメイン）からのAPIリクエストを制御する仕組み。Route Handlers側でレスポンスヘッダー（`Access-Control-Allow-Origin` 等）を設定し、許可するオリジンを絞り込むことで不正な外部サイトからのAPI呼び出しを防ぐ",
  "クライアント側の検証だけでなく、Server Actions や API 側で Zod を使った二重のガード（Validation）が絶対必須",
  "Cookie には `HttpOnly`, `Secure`, `SameSite=Lax` 属性を付与してセッションハイジャックをガード",
],
},

// 4.
{
stepNumber: 4,
title: "環境変数（.env）の厳格管理と型定義",
explanation:
  "DB接続情報や API 秘密鍵などの機密情報を安全に保持します。`NEXT_PUBLIC_` プレフィックスを付けた環境変数はビルド時にクライアント側のJSバンドルへ埋め込まれてブラウザからも参照可能になり、プレフィックスを付けない環境変数はサーバー側のコードでのみ参照可能でブラウザには一切送信されません。この違いを正しく理解し、環境変数自体にも Zod で型チェックをかけます。",
codeExample: `// src/env.ts (環境変数の型安全バリデーション)
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  // クライアントに露出しても良い変数には NEXT_PUBLIC_ を付ける
  NEXT_PUBLIC_API_URL: z.string().url(),
});

// アプリ起動時に環境変数をパース（不足していれば即座にビルドエラー！）
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});`,
keyPoints: [
  "`NEXT_PUBLIC_` を付けた環境変数は、ビルド時にクライアント向けJSバンドルへ値がそのまま埋め込まれ、ブラウザの開発者ツールからも閲覧可能な状態で露出する",
  "`NEXT_PUBLIC_` が付いていない環境変数はサーバー側（RSC / Server Actions / Route Handlers）でのみ参照可能で、クライアント側のバンドルには一切含まれずブラウザに送信されない",
  "この性質上、DB接続文字列やAPIシークレットキーなど『絶対に外部に漏らしてはいけない値』には `NEXT_PUBLIC_` を付けてはいけない",
  "環境変数の不備で本番環境が落ちるのを防ぐため、ビルド時・起動時に Zod で検証する手法（t3-env等）がプロの常識",
  "Git に `.env.local` や機密情報をコミットしないよう `.gitignore` を徹底する（詳細は次のStepで扱う）",
],
},

// 5.
{
stepNumber: 5,
title: ".gitignore による機密情報・不要ファイルの管理",
explanation:
  "前のStepで扱った環境変数（.env.local等）をはじめ、依存パッケージやビルド成果物など『Gitで管理すべきでないファイル』を `.gitignore` に明記することで、機密情報の漏洩やリポジトリの肥大化を防ぎます。create-next-appが生成する.gitignoreをベースに、代表的な記載項目を理解しましょう。",
codeExample: `# .gitignore

# 依存パッケージ（package.jsonから復元可能なため管理不要）
/node_modules

# Next.jsのビルド成果物（毎回のビルドで再生成されるため管理不要）
/.next/
/out/

# 環境変数ファイル（DB接続情報やAPIシークレットなどの機密情報を含むため絶対にコミットしない）
.env
.env.local
.env.*.local

# ログファイル
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS・エディタが自動生成する不要ファイル
.DS_Store
*.pem

# TypeScriptのビルド情報キャッシュ
*.tsbuildinfo
`,
keyPoints: [
  "node_modules や .next（ビルド成果物）は、他の開発者の環境でコマンド一つで再生成できるため、リポジトリに含めるとサイズが肥大化するだけで意味がない",
  ".env や .env.local はDB接続情報・APIキーなどの機密情報を含むため、誤ってコミットするとGitHubの履歴に永久に残ってしまう危険がある。万が一コミットしてしまった場合は、値の無効化（キーの再発行）も忘れずに行う",
  "create-next-appで生成される.gitignoreには主要な除外設定が最初から含まれているが、プロジェクト固有の秘密ファイル（証明書ファイル`*.pem`など）は必要に応じて追記する",
],
},

// 6.
{
stepNumber: 6,
title: "本番デプロイ（Vercel & オンプレミス / Docker / Node.js）",
explanation:
  "開発した App Router アプリケーションを本番環境へ公開します。Vercel への一発デプロイから、オンプレミス環境や Linux サーバ（Nginx + PM2 / Docker Container）で Next.js をスタンドアロン駆動させる構築手順までカバーします。",
codeExample: `# 1. standalone 出力の設定（next.config.ts）
# module.exports = { output: 'standalone' }
# これにより node_modules の最小限の依存関係だけが .next/standalone に出力される！

# 2. オンプレミス/Docker 用のマルチステージ Dockerfile 例
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]`,
keyPoints: [
  "Vercel: Push するだけで Edge Network / Serverless Functions へ最適化デプロイされる最高峰の体験",
  "オンプレミス / Docker: `output: 'standalone'` 設定を使うことで、イメージサイズを軽量化してコンテナ駆動可能",
  "本番運用の前には `npm run build` を実行して、ビルド時の TypeScript 型エラーや ESLint 違反をゼロにする",
],
},

];
