// src/data/curriculum.ts

export interface Topic {
  title: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  topics: string[];
}

// チャプターリスト オブジェクト (データ)
export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    title: "第1章: TypeScriptの基礎と環境整備",
    description: "型安全性がもたらす壊れないコードと、Node.js / tsconfigの基礎を固める",
    topics: ["型推論と明示的型定義", "tsconfig.jsonの役割", "パッケージマネージャの選定"],
  },
  {
    id: 2,
    title: "第2章: TypeScriptの実践テクニック",
    description: "GenericsやUtility Typesを使いこなし、型定義の壁を突破する",
    topics: ["Interface vs Type Alias", "Genericsの応用", "Utility Types (Pick/Omit)"],
  },
  {
    id: 3,
    title: "第3章: Reactの基礎知識",
    description: "コンポーネント指向とHooksを理解し、TSと組み合わせる",
    topics: ["JSX/TSXとVirtual DOM", "Props & State管理", "TypeScript × React Hooks"],
  },
  {
    id: 4,
    title: "第4章: Next.jsの基礎と環境整備",
    description: "App Routerのアーキテクチャとディレクトリ構造をマスターする",
    topics: ["SSR / SSG / RSCの概念", "create-next-appの構造", "App Routerのルーティング"],
  },
  {
    id: 5,
    title: "第5章: Prismaとデータベース（PostgreSQL/SQLite）連携",
    description: "TypeScriptの型安全性を崩さずにDBへアクセスする技術について",
    topics: ["ORM（Prisma）の概要と DB（SQLite/PostgreSQL）選定", "Prisma Schema", "Prisma Client", "型安全な CRUD 操作とトランザクション", "App Router(Server Actions)との結合"],
  },
  {
    id: 6,
    title: "第6章: Next.jsの実践開発",
    description: "Server ComponentsとServer Actionsを活用した実践的開発",
    topics: ["RSC vs Client Components", "Data Fetching", "Dynamic Routing & 画像最適化"],
  },
  {
    id: 7,
    title: "第7章: 認証・セキュリティと本番デプロイ",
    description: "Auth.js（NextAuth.v5）を用いた最新の型安全認証から、Web securityの防壁、環境変数の管理、そしてオンプレミスやクラウド（Vercel/Docker）への本番デプロイ手順を学習",
    topics: ["Auth.js（NextAuth.v5）による方安全認証"],
  },
/*  {
    id: 7,
    title: "第7章: アプリケーション開発実践",
    description: "本学習アプリを自力で構築し、Vercel/Dockerへデプロイする",
    topics: ["コンポーネント分割", "ウィザードState実装", "ビルド & デプロイ"],
  },*/
  {
    id: 8,
    title: "第8章: アプリケーション開発実践",
    description: "本学習アプリを自力で構築し、Vercel/Dockerへデプロイする",
    topics: ["コンポーネント分割", "ウィザードState実装", "ビルド & デプロイ"],
  },

];

