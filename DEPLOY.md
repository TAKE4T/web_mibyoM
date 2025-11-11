# デプロイガイド（おてまえ未病ハブ）

フロント: `mibyo.otemae-osu.com`  
WordPress (Headless): `wp.mibyo.otemae-osu.com`

---

## 1. WordPress 側チェック

1. `https://wp.mibyo.otemae-osu.com/graphql` が 200 を返すか確認  
2. WPGraphQL プラグイン有効化、パーマリンクを「投稿名」に設定  
3. `wordpress-cors-setup.php` のサンプルを使い、`mibyo.otemae-osu.com` と Vercel ドメインを許可  
4. テスト記事／アイキャッチ画像を最低 5 件登録

---

## 2. リポジトリ & 環境変数

```bash
git clone <repo>
cd web_omh/frontend
npm install   # ネットワーク環境に合わせて実行
cp .env.example .env.local
```

`.env.local`:

```
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wp.mibyo.otemae-osu.com/graphql
```

---

## 3. Vercel デプロイ

### Dashboard

1. Vercel → **Add New → Project**  
2. リポジトリを選択し、Root Directory を `frontend` に設定  
3. Environment Variables に `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wp.mibyo.otemae-osu.com/graphql`  
4. Deploy をクリック  
5. 成功後、**Settings → Domains** で `mibyo.otemae-osu.com` を追加

### CLI

```bash
npm install -g vercel
vercel login
cd frontend
vercel
vercel env add NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL
vercel --prod
```

---

## 4. 動作確認

- [ ] トップページ表示（未病レポート、特集ナビ）
- [ ] 記事詳細表示／画像読み込み
- [ ] カテゴリー・タグページ
- [ ] 検索、メルマガ、お問い合わせリンク
- [ ] レスポンシブ表示

---

## 5. CORS サンプル

```php
add_action( 'rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed = [
            'http://localhost:3000',
            'https://mibyo.otemae-osu.com',
            'https://<project>.vercel.app',
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
        }

        return $value;
    });
}, 15);
```

---

## 6. よくあるエラー

| 症状 | 対処 |
| --- | --- |
| 記事0件 | GraphQL URL が未設定／Basic 認証でブロック |
| 画像が壊れる | `next.config.ts` の `remotePatterns` に WP ドメインを追加 |
| CORS | WordPress 側で Vercel/本番ドメインを許可 |
| Build Error | `npm install` と `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` を再確認 |

---

## 7. 追加タスク

- Cloudflare 等で `mibyo.otemae-osu.com` の A/CNAME を Vercel に向ける  
- Vercel Analytics / Speed Insights でパフォーマンス監視  
- WordPress 側で定期的にバックアップ
