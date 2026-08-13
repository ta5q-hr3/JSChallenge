// CHAPTER 5
import { StepContent } from "@/types/wizard";

export const CHAPTER_5_STEPS: StepContent[] = [

// 1.
{
stepNumber: 1,
title: "ORM（Prisma）の概要と DB（SQLite/PostgreSQL）選定",
explanation: "ORM（Object-Relational Mapping）は、SQLを手書きせずにTypeScriptのオブジェクトとしてDB操作を行う仕組みです。PrismaはSchemaファイルから自動的に完全なTypeScript型を生成するため、コンパイル時点でタイポや型エラーを完璧にガードします。",
codeExample: `// prisma/schema.prisma (SQLiteの例：ローカル開発向け)
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "provider-js" // TypeScript型クライアントの生成
}

// 本番環境（PostgreSQL）に切り替える場合は datasource の provider を "postgresql" に変更し、
// url に環境変数 env("DATABASE_URL") を指定するだけ！`,
keyPoints: [
  "SQLite: ファイルベースで動作し、追加サーバ構築不要でローカル開発・テストに最適",
  "PostgreSQL: 高度な機能、スケーラビリティ、オンプレミスやクラウド本番環境での圧倒的標準",
  "Prisma Schema: DB構造を宣言的に定義し、TypeScript型定義の単一真実源（Single Source of Truth）となる",
],
},

// 2.
{
stepNumber: 2,
title: "Prisma Schema によるモデル定義とリレーションシップ",
explanation: "テーブル構造とテーブル間の関連（1対多、多対多）をスキーマ言語で定義します。型チェックと外部キー制約を宣言的に構築できます。",
codeExample: `// prisma/schema.prisma

enum Role {
  USER
  ADMIN
  TRAINER
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]   // 1対多のリレーション（1人のUserが複数のPostを持つ）
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}`,
keyPoints: [
  "@id, @unique, @default などの属性（Attribute）で制約を宣言",
  "@relation でリレーションシップと親データ削除時の挙動（onDelete: Cascade等）を指定",
],
},

// 3.
{
stepNumber: 3,
title: "マイグレーション実行と Prisma Client の自動生成",
explanation: "スキーマの変更を実際のDBテーブル構造に反映する「Migration」と、型定義済みのクライアントライブラリを生成するコマンドライン操作をマスターします。",
codeExample: `# 1. マイグレーションの作成と実行（DBへテーブル作成 + 型の自動生成）
npx prisma migrate dev --name init

# 2. Prisma Client の手動再生成（スキーマ変更時）
npx prisma generate

# 3. GUIでDBデータを直接閲覧・編集できる最高ツール「Prisma Studio」の起動
npx prisma studio`,
keyPoints: [
  "prisma migrate dev: マイグレーションSQLファイルを自動作成し、DBに適用",
  "node_modules/.prisma/client 内に最新の型定義が自動生成されるため、補完が爆速で働く",
],
},

// 4.
{
stepNumber: 4,
title: "Prisma Client による型安全な CRUD 操作とトランザクション",
explanation: "自動生成された `prisma` インスタンスを使用して、データの作成（Create）、読み出し（Read）、更新（Update）、削除（Delete）を実行します。",
codeExample: `import { PrismaClient } from "@prisma/client";

// Singleton パターンで PrismaClient を生成（開発時の接続数オーバーフローをガード）
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// CRUD 操作の例
async function main() {
  // Create & Relation 接続
  const newUser = await prisma.user.create({
    data: {
      email: "macho@example.com",
      name: "アノニ摩寿男",
      posts: {
        create: { title: "胸トレの真髄", content: "大胸筋を追い込め！" },
      },
    },
    include: { posts: true }, // リレーションデータも一括取得（完全型補完！）
  });

  // トランザクション処理（複数操作の一括成功またはロールバック）
  await prisma.$transaction([
    prisma.user.update({ where: { id: newUser.id }, data: { role: "TRAINER" } }),
    prisma.post.create({ data: { title: "背中トレ", content: "広背筋！", authorId: newUser.id } }),
  ]);
}`,
keyPoints: [
  "include や select を使うと、取得結果の型も動的に推論されてネスト構造まで安全になる",
  "PrismaClient インスタンスは開発環境でのホットリロード対策としてグローバル保持する",
  "$transaction を使用してデータの整合性を鉄壁にする",
],
},

// 5.
{
stepNumber: 5,
title: "Next.js App Router (Server Actions) との完全結合",
explanation: "第4章で学んだ Server Actions や Server Components と Prisma を組み合わせ、フォーム入力から直接DB更新までを型安全かつ最小限のコードで実現します。",
codeExample: `// app/actions/post.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = formData.get("authorId") as string;

  if (!title || !content) {
    return { error: "タイトルと本文は必須です" };
  }

  // DBへの書き込み処理
  await prisma.post.create({
    data: { title, content, authorId, published: true },
  });

  // キャッシュを破棄して最新の投稿一覧を表示
  revalidatePath("/posts");

  return { success: true };
}`,
keyPoints: [
  "Server Component または Server Actions から直接 Prisma 経由で DB を叩くため API 層の自作が不要",
  "サーバー側のみで Prisma が動くため、DBの接続情報や認証情報がブラウザに漏洩しない",
],
},
];

