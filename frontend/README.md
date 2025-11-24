# おてまえ文庫 - Webメディア

東洋と西洋のヘルスケア知識を結び、未病ケアの実践知を届けるウェブメディア。Next.js + Headless WordPress で構築し、mibyo.otemae-osu.com へ配信します。

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router)
- **スタイリング**: Tailwind CSS
- **データ取得**: WordPress GraphQL API
- **デプロイ**: Vercel
- **言語**: TypeScript

## 機能

- ✅ ナビゲーション（オンライン保険調剤／東洋薬学 等）を固定で表示
- ✅ タグ連動の特集ナビ（毎日の食事・運動の理屈 など）
- ✅ WordPress GraphQL + ISR による高速配信
- ✅ カテゴリー・タグ・検索・ランキング表示
- ✅ メルマガ／お問い合わせなどの導線

## セットアップ

### 1. 環境変数の設定

`.env.local` を作成し、WordPress の GraphQL エンドポイントを指定します。

```bash
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wpmibyo.otemae-osu.com/graphql
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

<http://localhost:3000> にアクセスして動作を確認します。

## Vercel へのデプロイ

1. Vercel プロジェクトを作成し GitHub リポジトリを接続
2. `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` に `https://wpmibyo.otemae-osu.com/graphql` を設定
3. `npm run build` が通ることを確認してデプロイ

## プロジェクト構成

```
frontend/
├── app/                   # Next.js App Router
│   ├── posts/[slug]/      # 記事詳細ページ
│   ├── page.tsx           # トップページ
│   ├── layout.tsx         # 共有レイアウト
│   └── globals.css        # グローバルスタイル
├── components/            # UI コンポーネント
│   ├── Header.tsx         # ナビゲーション
│   ├── Footer.tsx         # フッター
│   └── ArticleCard.tsx    # 記事カード
├── lib/wordpress.ts       # GraphQL クライアント
├── public/                # 画像・静的ファイル
└── prisma/                # （オプション）データ永続化設定
```

## WordPress 側の設定

1. **WPGraphQL プラグイン** を有効化
2. **パーマリンク** を「投稿名」に設定
3. 画像をフロントで表示できるよう `wpmibyo.otemae-osu.com` でホスティング
4. 必要に応じて CORS を許可

```php
add_action('init', function () {
    header('Access-Control-Allow-Origin: https://mibyo.otemae-osu.com');
    header('Access-Control-Allow-Credentials: true');
});
```

## トラブルシューティング

- **記事が取得できない**: `https://wpmibyo.otemae-osu.com/graphql` が 200 を返しているか確認
- **画像が表示されない**: `next.config.ts` の `remotePatterns` に画像のドメインが含まれているか確認
- **ISR が反映されない**: `revalidate` の秒数（`app/page.tsx`）と Vercel のキャッシュ設定を確認

## 関連ドメイン

- フロント: `https://mibyo.otemae-osu.com`
- Headless WordPress: `https://wpmibyo.otemae-osu.com`
