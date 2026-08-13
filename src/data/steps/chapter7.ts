// CHAPTER 7
import { StepContent } from "@/types/wizard";

export const CHAPTER_7_STEPS: StepContent[] = [
// 1.
{
stepNumber: 1,
title: "Auth.js (NextAuth.js v5) による型安全な認証基盤",
explanation:
  "Next.js App Router に完全対応した Auth.js (NextAuth.js v5) を導入します。OAuth（GitHub/Google）や OAuth Provider、Credentials 認証をサポートし、セッションデータに TypeScript の型注釈（Session Callback）を付与して厳格に管理します。",
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
  "Webアプリケーションの脆弱性を防ぐための必須テクニックです。入力データの改ざんや不正スクリプト実行（XSS）を防ぐため、Zod スキーマによるサーバー側の厳格な型検証を徹底します。",
codeExample: `import { z } from "zod";

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
}`,
keyPoints: [
  "クライアント側の検証だけでなく、Server Actions や API 側で Zod を使った二重のガード（Validation）が絶対必須",
  "React/Next.js は標準で XSS エスケープを行うが、`dangerouslySetInnerHTML` の安易な使用は厳禁",
  "Cookie には `HttpOnly`, `Secure`, `SameSite=Lax` 属性を付与してセッションハイジャックをガード",
],
},

// 4.
{
stepNumber: 4,
title: "環境変数（.env）の厳格管理と型定義",
explanation:
  "DB接続情報や API 秘密鍵などの機密情報を安全に保持します。`NEXT_PUBLIC_` プレフィックスの有無によるクライアント/サーバー間の露出範囲の違いを理解し、環境変数自体にも Zod で型チェックをかけます。",
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
  "`NEXT_PUBLIC_` が付いていない環境変数はサーバー側（RSC / Server Actions / Route Handlers）でのみ参照可能",
  "環境変数の不備で本番環境が落ちるのを防ぐため、ビルド時・起動時に Zod で検証する手法（t3-env等）がプロの常識",
  "Git に `.env.local` や機密情報をコミットしないよう `.gitignore` を徹底する",
],
},

// 5.
{
stepNumber: 5,
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

