# WordPress 側のセットアップガイド

## 1. functions.php の設定

WordPress側の`functions.php`に以下のコードを追加してください：

```php
<?php
/**
 * WordPress CORS設定 & GraphQL設定
 *
 * このコードを以下のファイルに追加してください:
 * /wp-content/themes/[your-theme]/functions.php
 */

// REST API & GraphQL のCORS設定
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $allowed_origins = [
            'http://localhost:3000',           // ローカル開発
            'https://mibyo.otemae-osu.com',   // 本番フロント
            'https://*.vercel.app',            // Vercel プレビュー
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        // ワイルドカード対応
        $is_allowed = false;
        foreach ($allowed_origins as $allowed) {
            if ($allowed === $origin || 
                (strpos($allowed, '*') !== false && 
                 preg_match('#' . str_replace('*', '.*', preg_quote($allowed)) . '#', $origin))) {
                $is_allowed = true;
                break;
            }
        }

        if ($is_allowed) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            header('Access-Control-Max-Age: 3600');
        }

        return $value;
    });
}, 15);

// WPGraphQL プラグイン有効化時の設定
add_filter('graphql_request_should_execute', function($should_execute) {
    return true;
});

// GraphQL キャッシュ制御
add_filter('graphql_response_cache_headers', function() {
    return [
        'Cache-Control' => 'public, max-age=3600, must-revalidate',
    ];
});

// アイキャッチ画像の完全URLを確保
add_filter('graphql_post_featured_image_url', function($url, $post) {
    if (!$url && has_post_thumbnail($post->ID)) {
        $url = get_the_post_thumbnail_url($post->ID, 'full');
    }
    return $url;
}, 10, 2);
```

### 設定の詳細

| 設定項目 | 内容 |
|---------|------|
| **CORS許可ドメイン** | localhost:3000（開発）、本番フロント、Vercelプレビュー |
| **許可メソッド** | GET, POST, OPTIONS, PUT, DELETE |
| **キャッシュ制御** | 3600秒（1時間）の公開キャッシュ |

---

## 2. Vercel との連携 - DNS 設定

Vercel はグローバルなエッジネットワークを使用しているため、**固定IPアドレスがありません**。代わりに **CNAME レコード** で設定してください。

### ⚠️ 重要：Aレコード（固定IP）は使用できません

Vercel は複数のデータセンターを使用しているため、Aレコード（固定IP）での設定はできません。必ず **CNAME** を使用してください。

---

## 3. DNS 設定手順

### Vercel での設定

1. **Vercel Dashboard** にログイン
2. プロジェクト選択 → **Settings → Domains**
3. **Add Domain** をクリック
4. `wpmibyo.otemae-osu.com` を入力
5. DNS設定の確認画面で CNAME が表示される

```
Name: wpmibyo
Type: CNAME
Value: cname.vercel-dns.com
```

6. DNS設定を完了してから Vercel で「Verify DNS Configuration」をクリック

### DNSプロバイダー別設定例

#### Cloudflare

| タイプ | ホスト名 | 値 | TTL |
|--------|---------|-----|------|
| CNAME | wpmibyo | cname.vercel-dns.com | Auto |

**手順:**
1. Cloudflare Dashboard にログイン
2. ドメイン選択 → **DNS**
3. **レコード追加** をクリック
4. 上記の値を入力して保存

#### ムームードメイン

| タイプ | ホスト名 | 値 |
|--------|---------|-----|
| CNAME | wpmibyo | cname.vercel-dns.com |

**手順:**
1. ムームードメイン コントロールパネルにログイン
2. **ドメイン一覧** → **ムームーDNス**
3. CNAME レコードを追加

#### さくらインターネット

| タイプ | ホスト名 | 値 |
|--------|---------|-----|
| CNAME | wpmibyo | cname.vercel-dns.com |

**手順:**
1. さくらのコントロールパネルにログイン
2. **DNS設定** → **レコード追加**
3. CNAME を選択して上記の値を入力

#### お名前.com

| タイプ | ホスト名 | 値 |
|--------|---------|-----|
| CNAME | wpmibyo | cname.vercel-dns.com |

**手順:**
1. お名前.com Navi にログイン
2. **DNS設定** → **レコード追加**
3. CNAME を選択して上記の値を入力

---

## 4. DNS 設定の確認

設定後、以下のコマンドで確認できます：

```bash
# nslookupで確認
nslookup wpmibyo.otemae-osu.com

# 出力例:
# Name: wpmibyo.otemae-osu.com
# Address: 76.76.19.165 (※Vercelのエッジサーバー)
```

または

```bash
# digで詳細確認
dig wpmibyo.otemae-osu.com

# CNAMEが正しく設定されているか確認
# wpmibyo.otemae-osu.com. IN CNAME cname.vercel-dns.com.
```

---

## 5. トラブルシューティング

### DNS設定が反映されない場合

1. **TTLの確認**: 前の設定が残っている場合、TTLが消費されるまで待つ（最大48時間）
2. **キャッシュをクリア**: ブラウザのキャッシュをクリア
3. **別のDNS確認ツール**: 
   - [DNS Checker](https://dnschecker.org/)
   - [WhatsMyDNS](https://www.whatsmydns.net/)

### CORS エラーが表示される場合

1. WordPress の `functions.php` 設定を確認
2. `allowed_origins` に本番ドメインが含まれているか確認
3. WPGraphQL プラグインが有効か確認

### SSL証明書エラー

Vercel は自動的に Let's Encrypt の SSL 証明書をプロビジョニングします。

1. Vercel Dashboard で **SSL/TLS** を確認
2. 「Provisioning」中の場合は数分待機

---

## 6. セキュリティ推奨事項

### 本番環境での設定例

```php
// より厳密なCORS設定
$allowed_origins = [
    'https://mibyo.otemae-osu.com',        // 本番フロント
    'https://www.mibyo.otemae-osu.com',    // wwwあり
];

// 開発環境は除外
if (defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'production') {
    // 本番のみの設定
}
```

### 環境変数での管理

```php
$allowed_origins = explode(',', $_ENV['CORS_ALLOWED_ORIGINS'] ?? 'https://mibyo.otemae-osu.com');
```

---

## 7. チェックリスト

本番デプロイ前に以下を確認してください：

- [ ] WPGraphQL プラグインが有効化されている
- [ ] WordPress パーマリンク設定が「投稿名」に設定されている
- [ ] functions.php に CORS設定が追加されている
- [ ] DNS に CNAME レコードが設定されている
- [ ] SSL 証明書が Vercel で発行されている
- [ ] `https://wpmibyo.otemae-osu.com/graphql` が 200 を返す
- [ ] フロントエンドから記事が取得できている
- [ ] 画像が正常に表示されている

---

## 8. 関連ドメイン一覧

| 用途 | ドメイン | 説明 |
|------|---------|------|
| フロントエンド | `https://mibyo.otemae-osu.com` | Next.js (Vercel) |
| ヘッドレスWP | `https://wpmibyo.otemae-osu.com` | WordPress (GraphQL) |
| WP管理画面 | `https://wpmibyo.otemae-osu.com/wp-admin/` | WordPress Dashboard |
| GraphQL | `https://wpmibyo.otemae-osu.com/graphql` | GraphQL Endpoint |

