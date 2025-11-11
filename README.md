# おてまえ未病ハブ

未病・セルフケアの実践知を届けるウェブメディア。Next.js + Headless WordPress で構築し、フロントは `mibyo.otemae-osu.com`、CMS は `wp.mibyo.otemae-osu.com` を想定しています。

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router) / TypeScript
- **スタイリング**: Tailwind CSS
- **データ取得**: WPGraphQL
- **ホスティング**: Vercel

## ディレクトリ構成

```
web_omh/
├── frontend/                # Next.js アプリ
│   ├── app/                 # ルーティング／ページ
│   ├── components/          # UI コンポーネント
│   ├── lib/wordpress.ts     # GraphQL クライアント
│   └── public/              # 静的ファイル
├── wordpress-cors-setup.php # WordPress 側 CORS サンプル
└── README.md
```

## セットアップ

```bash
git clone <repo>
cd web_omh/frontend
npm install
cp .env.example .env.local
```

`.env.local`:

```
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wp.mibyo.otemae-osu.com/graphql
```

ローカル開発:

```bash
npm run dev
# http://localhost:3000
```

## Vercel デプロイ

1. Vercel で新規プロジェクトを作成し、ルートディレクトリを `frontend` に設定
2. 環境変数 `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wp.mibyo.otemae-osu.com/graphql`
3. `npm run build` が通ることを確認してデプロイ
4. カスタムドメイン `mibyo.otemae-osu.com` を割り当て

## WordPress 側のポイント

- WPGraphQL プラグインを有効化
- `https://wp.mibyo.otemae-osu.com/graphql` が 200 を返すことを確認
- アイキャッチ画像の CDN/ドメインを Next.js 側 (`next.config.ts`) で許可
- `wordpress-cors-setup.php` の要領で `mibyo.otemae-osu.com` や Vercel ドメインを CORS 許可

## 既定ページ／カテゴリ

- 固定ナビ: オンライン保険調剤／東洋薬学／西洋薬学／未病とは／カラダの仕組み／学び／書籍紹介／イベント・マルシェ
- 特集タグ: 毎日の食事／運動の理屈／睡眠ナビ／和韓蒸しとは／頭皮ケア特集／肌ケアとは／腸活ブームを振り返る／幹細胞治療最前線／コーヒー豆を科学する

## トラブルシューティング

| 症状 | チェックポイント |
| --- | --- |
| 記事が取得できない | GraphQL URL・WPGraphQL プラグイン・Basic 認証の有無 |
| 画像が表示されない | `next.config.ts` の `remotePatterns` に WP ドメインがあるか |
| CORS エラー | WordPress 側ヘッダーに Vercel/本番ドメインを追加したか |
| ISR が更新されない | `app/page.tsx` の `revalidate` と Vercel キャッシュ設定 |

## ライセンス

© おてまえ未病ハブ / 無断転載禁止
