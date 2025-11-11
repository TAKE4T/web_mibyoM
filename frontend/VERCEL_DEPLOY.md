# Vercel デプロイ手順（おてまえ未病ハブ）

`mibyo.otemae-osu.com` で公開する Next.js フロントを Vercel にデプロイするための手順です。CLI と Dashboard どちらでも進められます。

---

## 🚀 方法 1: Vercel CLI（最速）

### 1. CLI をセットアップ

```bash
npm install -g vercel
vercel login
```

### 2. プロジェクトをデプロイ

```bash
cd frontend
vercel
```

プロンプトの主な回答例:

```
? What's your project's name? otemae-mibyo-hub
? In which directory is your code located? ./
? Want to override the settings? n
```

### 3. 環境変数を登録

```bash
vercel env add NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL
```

値に `https://wpmibyo.otemae-osu.com/graphql` を入力し、Production / Preview / Development のすべてに設定しておくと安心です。

Basic 認証で WordPress 全体を保護している場合は、以下も登録します。

```bash
vercel env add WORDPRESS_GRAPHQL_BASIC_AUTH_USER
vercel env add WORDPRESS_GRAPHQL_BASIC_AUTH_PASSWORD
```

### 4. 本番デプロイ

```bash
vercel --prod
```

公開 URL が表示されたら完了です。

---

## 🌐 方法 2: Dashboard + GitHub

1. GitHub でリポジトリ（例: `otemae-mibyo-hub`）を作成し、`frontend` ディレクトリを push
2. [Vercel](https://vercel.com) で **Add New → Project**
3. 対象リポジトリを選択し **Import**
4. **Environment Variables** に下記を設定  
   | Name | Value |  
   | --- | --- |  
   | `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` | `https://wpmibyo.otemae-osu.com/graphql` |
   | `WORDPRESS_GRAPHQL_BASIC_AUTH_USER` | *(Basic認証利用時のみ)* |
   | `WORDPRESS_GRAPHQL_BASIC_AUTH_PASSWORD` | *(Basic認証利用時のみ)* |
5. 「Deploy」をクリック

---

## 🔧 WordPress 側の CORS 設定

Vercel URL／本番ドメインを許可しておきます。

```php
add_action( 'init', function () {
    $allowed_origins = [
        'http://localhost:3000',
        'https://mibyo.otemae-osu.com',
        'https://<your-vercel-project>.vercel.app',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
});
```

---

## ✅ 動作確認チェックリスト

- [ ] トップページが表示される
- [ ] WordPress から記事が取得できる
- [ ] 画像が表示される（`wpmibyo.otemae-osu.com` が許可済み）
- [ ] 特集ナビやカテゴリリンクが機能する
- [ ] メルマガ／お問い合わせページに遷移できる

---

## 🔄 継続的デプロイ

GitHub 連携を行った場合、`main` への `git push` で自動デプロイされます。

```bash
git add .
git commit -m "feat: update feature tags"
git push origin main
```

---

## 🐛 トラブルシューティング

| 症状 | 確認ポイント |
| --- | --- |
| 記事が 0 件になる | `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` が正しいか／WPGraphQL が有効か |
| 画像が表示されない | `next.config.ts` の `remotePatterns` に `wpmibyo.otemae-osu.com` があるか |
| CORS エラー | WordPress 側で Vercel ドメインを許可したか |
| ISR が更新されない | `app/page.tsx` の `revalidate` と Vercel Cache 設定を確認 |

問題が解決しない場合は `vercel logs` で実行ログを確認してください。
