# Next.js + Headless WordPress + Vercel セットアップガイド

このドキュメントでは、本プロジェクトの完全なセットアップ手順を解説します。

## 目次

1. [プロジェクト構成](#プロジェクト構成)
2. [WordPress設定](#wordpress設定)
3. [Next.js設定](#nextjs設定)
4. [Vercelデプロイ](#vercelデプロイ)
5. [開発フロー](#開発フロー)
6. [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト構成

### 技術スタック

| レイヤー | 技術 | 用途 |
|---------|------|------|
| **フロントエンド** | Next.js 16.0.1 (App Router) | Webアプリケーション |
| **CMS** | WordPress (Headless) | コンテンツ管理 |
| **API** | GraphQL (WPGraphQL) | データ取得 |
| **スタイリング** | Tailwind CSS 4 | UI/デザイン |
| **言語** | TypeScript | 型安全性 |
| **ホスティング** | Vercel | 本番環境 |

### アーキテクチャ図

```
┌─────────────────────────────────────────┐
│                                         │
│  ユーザー (ブラウザ)                     │
│                                         │
└────────────────┬────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────┐
│                                         │
│  Vercel (Next.js App)                   │
│  - SSR/ISR                              │
│  - 画像最適化                            │
│  - Edge Functions                       │
│                                         │
└────────────────┬────────────────────────┘
                 │
                 │ GraphQL API
                 ▼
┌─────────────────────────────────────────┐
│                                         │
│  WordPress (Headless CMS)               │
│  - WPGraphQL プラグイン                  │
│  - 記事管理                              │
│  - メディアライブラリ                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## WordPress設定

### 1. WordPress インストール

本プロジェクトでは、WordPressをHeadless CMSとして使用します。

```bash
# WordPress 推奨バージョン: 6.0以上
# PHP 推奨バージョン: 8.0以上
```

### 2. 必須プラグインのインストール

#### WPGraphQL プラグイン

GraphQL APIを有効化するために必要です。

**インストール方法:**

1. WordPressダッシュボードにログイン
2. 「プラグイン」→「新規追加」
3. 「WPGraphQL」で検索
4. 「今すぐインストール」→「有効化」

**または、手動インストール:**

```bash
cd wp-content/plugins
wget https://github.com/wp-graphql/wp-graphql/releases/latest/download/wp-graphql.zip
unzip wp-graphql.zip
```

WordPressダッシュボードで有効化してください。

### 3. GraphQL エンドポイントの確認

プラグインを有効化すると、以下のエンドポイントが利用可能になります:

```
https://your-wordpress-domain.com/graphql
```

**動作確認:**

ブラウザで以下のURLにアクセスして、GraphiQL IDE が表示されることを確認:

```
https://your-wordpress-domain.com/graphql
```

### 4. パーマリンク設定

**設定 → パーマリンク設定** で「投稿名」を選択:

```
https://your-domain.com/%postname%/
```

### 5. CORS設定（必要な場合）

Next.jsアプリからWordPress APIにアクセスするため、CORS設定が必要な場合があります。

`functions.php` に以下を追加:

```php
// CORSヘッダーを追加
add_action('graphql_init', function() {
    // 開発環境と本番環境のオリジンを許可
    $allowed_origins = [
        'http://localhost:3000',
        'https://your-vercel-domain.vercel.app',
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
});
```

### 6. User-Agent制限の解除

一部のWordPressサーバーでは、User-Agentが必要です。

本プロジェクトでは、GraphQLクライアントに以下のヘッダーを設定済み:

```typescript
// lib/wordpress.ts
const client = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NextJS/16.0; +https://mibyo.otemae-osu.com)',
  },
});
```

### 7. テストデータの投稿

WordPressで記事を作成してテスト:

1. **投稿 → 新規追加**
2. タイトルと本文を入力
3. **カテゴリー** を設定
4. **アイキャッチ画像** を設定（推奨サイズ: 1200x630px）
5. 「公開」をクリック

---

## Next.js設定

### 1. プロジェクトのクローン/作成

```bash
# 既存プロジェクトの場合
git clone <repository-url>
cd frontend

# または新規作成の場合
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
```

### 2. 依存関係のインストール

```bash
npm install
```

**主要な依存関係:**

```json
{
  "dependencies": {
    "next": "16.0.1",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "graphql": "^16.12.0",
    "graphql-request": "^7.3.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 3. 環境変数の設定

`.env.local` ファイルを作成:

```bash
cp .env.example .env.local
```

`.env.local` の内容:

```bash
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wp.mibyo.otemae-osu.com/graphql
```

**注意:**
- `NEXT_PUBLIC_` プレフィックスは、クライアント側で環境変数を使用するために必要です
- 本番環境では、Vercelの環境変数設定を使用します

### 4. Next.js設定ファイル

#### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.mibyo.otemae-osu.com', // WordPressのドメイン
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

**設定内容:**
- `images.remotePatterns`: WordPressの画像URLを`next/image`で最適化

### 5. GraphQL クライアントの実装

`lib/wordpress.ts` を作成:

```typescript
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://wp.mibyo.otemae-osu.com/graphql';

// GraphQLクライアントの作成
const client = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NextJS/16.0)',
  },
});

export interface Post {
  id: string;
  databaseId: number;
  date: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
}

// 記事一覧を取得
export async function getPosts(params: {
  page?: number;
  perPage?: number;
} = {}): Promise<{ posts: Post[]; total: number }> {
  const { perPage = 10 } = params;

  const query = gql`
    query GetPosts($first: Int!) {
      posts(first: $first, where: { status: PUBLISH }) {
        nodes {
          id
          databaseId
          date
          slug
          title
          content
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const data: any = await client.request(query, { first: perPage });
  const posts = data.posts.nodes || [];

  return { posts, total: posts.length };
}

// 記事をスラッグで取得
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = gql`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        date
        slug
        title
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;

  const data: any = await client.request(query, { slug });
  return data.post || null;
}
```

### 6. ISR (Incremental Static Regeneration) 設定

`app/page.tsx` でISRを設定:

```typescript
// 60秒ごとに静的ページを再生成
export const revalidate = 60;

export default async function Home() {
  const { posts } = await getPosts({ perPage: 30 });

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**ISRのメリット:**
- 初回アクセス時は静的ページを高速配信
- 60秒ごとにバックグラウンドで再生成
- WordPressで記事を更新後、最大60秒で反映

### 7. 動的ルーティング設定

`app/posts/[slug]/page.tsx` を作成:

```typescript
import { getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 8. ローカル開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて動作確認。

---

## Vercelデプロイ

### 方法1: Vercel CLI（推奨）

#### ステップ1: Vercel CLIのインストール

```bash
npm install -g vercel
```

#### ステップ2: Vercelにログイン

```bash
vercel login
```

GitHubアカウントでログイン。

#### ステップ3: プロジェクト設定

プロジェクトルートに `vercel.json` を作成:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

**設定内容:**
- `regions: ["sin1"]`: シンガポールリージョン（アジア最適化）

#### ステップ4: デプロイ

```bash
vercel
```

質問に答える:

```
? Set up and deploy "~/frontend"? [Y/n] y
? Which scope do you want to deploy to? [あなたのアカウント]
? Link to existing project? [y/N] n
? What's your project's name? otemae-mibyo-hub
? In which directory is your code located? ./
```

#### ステップ5: 環境変数を設定

```bash
vercel env add NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL
```

値を入力:

```
https://wp.mibyo.otemae-osu.com/graphql
```

Environment: **Production** を選択

#### ステップ6: 本番デプロイ

```bash
vercel --prod
```

デプロイが完了すると、URLが表示されます:

```
https://otemae-mibyo-hub.vercel.app
```

### 方法2: GitHub連携

#### ステップ1: GitHubリポジトリ作成

1. [GitHub](https://github.com/new) で新規リポジトリ作成
2. リポジトリ名を入力（例: `otemae-mibyo-hub`）
3. 「Create repository」をクリック

#### ステップ2: コードをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[ユーザー名]/otemae-mibyo-hub.git
git push -u origin main
```

#### ステップ3: Vercelでインポート

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでログイン
3. 「Add New... → Project」をクリック
4. リポジトリを選択
5. 「Import」をクリック

#### ステップ4: 環境変数設定

**Environment Variables** セクションで追加:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` | `https://wp.mibyo.otemae-osu.com/graphql` |

#### ステップ5: デプロイ

「Deploy」をクリック。

約2-3分でデプロイ完了。

### デプロイ後の確認

1. ブラウザでVercel URLにアクセス
2. 記事一覧が表示されることを確認
3. 記事詳細ページにアクセスして動作確認

---

## 開発フロー

### ローカル開発

```bash
# 開発サーバー起動
npm run dev

# TypeScript型チェック
npm run type-check

# リンター実行
npm run lint

# ビルド確認
npm run build
npm run start
```

### WordPressで記事を更新後

1. WordPressで記事を追加/編集
2. ローカル: ブラウザをリロード（すぐに反映）
3. 本番: 最大60秒後に自動反映（ISR）

### GitHubプッシュ後の自動デプロイ

```bash
# コードを変更
git add .
git commit -m "Update: feature"
git push

# Vercelが自動的にデプロイ（約2-3分）
```

---

## トラブルシューティング

### 記事が表示されない

**原因1:** WordPress GraphQL APIが無効

**解決策:**
1. WordPressダッシュボード → プラグイン → WPGraphQL が有効化されているか確認
2. ブラウザで `https://your-wordpress-domain.com/graphql` にアクセスして、GraphiQL画面が表示されるか確認

**原因2:** CORS エラー

**解決策:**
ブラウザのコンソールで以下のエラーが出る場合:

```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

WordPress `functions.php` にCORS設定を追加（上記参照）

**原因3:** 環境変数の設定ミス

**解決策:**
```bash
# ローカル環境
cat .env.local

# Vercel環境
vercel env ls
```

### 画像が表示されない

**原因:** `next.config.ts` で画像ドメインが許可されていない

**解決策:**

`next.config.ts` で `images.remotePatterns` にWordPressドメインを追加:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wordpress-domain.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

### ビルドエラー

**原因:** TypeScript型エラー

**解決策:**

```bash
# 型チェック
npx tsc --noEmit

# キャッシュクリア
rm -rf .next
npm run build
```

### 403エラー（WordPress API）

**原因:** User-Agentヘッダーが必要

**解決策:**

`lib/wordpress.ts` でGraphQLクライアントにヘッダーを追加（上記参照）

### Vercelデプロイ時のエラー

**原因:** 環境変数が設定されていない

**解決策:**

```bash
# 環境変数を確認
vercel env ls

# 追加
vercel env add NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL

# 再デプロイ
vercel --prod
```

---

## まとめ

本ガイドでは、以下の設定を完了しました:

1. **WordPress設定**
   - WPGraphQLプラグインのインストール
   - GraphQL APIエンドポイントの有効化
   - CORS設定

2. **Next.js設定**
   - GraphQLクライアントの実装
   - ISR（Incremental Static Regeneration）の設定
   - 画像最適化の設定

3. **Vercelデプロイ**
   - Vercel CLIまたはGitHub連携
   - 環境変数の設定
   - 自動デプロイの設定

### 次のステップ

- [ ] WordPressで記事を追加
- [ ] カテゴリーを作成
- [ ] アイキャッチ画像を設定
- [ ] SEO設定を確認
- [ ] カスタムドメインの設定（オプション）

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [WPGraphQL Documentation](https://www.wpgraphql.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GraphQL Request Library](https://github.com/jasonkuhrt/graphql-request)

---

**最終更新:** 2025-11-10
