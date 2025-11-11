# WordPress へ記事を追加する方法

## 📋 概要

このディレクトリに含まれる `wordpress-add-posts.php` スクリプトを使用して、WordPress に5件のサンプル記事を一括追加できます。

---

## 🚀 使用方法

### 方法1: ブラウザでアクセス（推奨）

1. `wordpress-add-posts.php` を WordPress のルートディレクトリに配置
2. ブラウザでアクセス:
   ```
   https://wpmibyo.otemae-osu.com/wordpress-add-posts.php
   ```
3. 記事が追加されたか確認
4. スクリプトは削除してもOK

### 方法2: WP-CLI を使用

```bash
cd /path/to/wordpress
php wordpress-add-posts.php
```

### 方法3: WordPress 管理画面から手動追加

1. WordPress 管理画面にログイン
2. **投稿** → **新規作成**
3. 以下の記事を追加:

---

## 📝 追加される記事一覧

### 1. 未病とは - セルフケアの実践知を学ぶ
- **カテゴリ**: 未病とは
- **タグ**: 未病, セルフケア, 東洋医学
- **内容**: 未病の概念と三段階、セルフケアの重要性

### 2. 毎日の食事で始める健康管理
- **カテゴリ**: 毎日の食事
- **タグ**: 食事, 栄養, 医食同源
- **内容**: 医食同源の考え方、五色食べる習慣

### 3. 運動の理屈 - なぜ体を動かすことが大切か
- **カテゴリ**: 運動の理屈
- **タグ**: 運動, 健康, フィットネス
- **内容**: 運動がもたらす効果、無理のない運動習慣

### 4. 良質な睡眠がもたらす効果
- **カテゴリ**: 睡眠ナビ
- **タグ**: 睡眠, 休息, 健康
- **内容**: 睡眠の質を高めるコツ、推奨睡眠時間

### 5. ストレス管理と瞑想
- **カテゴリ**: セルフケア
- **タグ**: ストレス, 瞑想, メンタルヘルス
- **内容**: 瞑想のメリット、簡単な瞑想方法

---

## ✅ 記事追加後の確認

### 1. WordPress 管理画面で確認
```
投稿 → すべて表示
```
5件の記事が表示されているか確認

### 2. GraphQL で確認

```bash
curl -X POST https://wpmibyo.otemae-osu.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{posts(first:5){nodes{id title}}}"
  }'
```

**期待される応答:**
```json
{
  "data": {
    "posts": {
      "nodes": [
        {"id": "cG9zdDox", "title": "未病とは - セルフケアの実践知を学ぶ"},
        {"id": "cG9zdDoy", "title": "毎日の食事で始める健康管理"},
        // ... 他の記事
      ]
    }
  }
}
```

### 3. フロントエンドで確認

ローカル開発環境で確認:
```bash
cd frontend
npm run dev
```

`http://localhost:3000` にアクセスして、トップページに記事が表示されているか確認

---

## 🔧 トラブルシューティング

### エラー: "管理者権限が必要です"

**原因**: WordPress にログインしていない状態でスクリプトを実行

**対処法**:
1. WordPress 管理画面にログイン
2. ブラウザの同じセッションでスクリプトを実行

### エラー: "wp-load.php が見つかりません"

**原因**: スクリプトが WordPress ルートディレクトリにない

**対処法**:
1. `wordpress-add-posts.php` を WordPress のルートディレクトリに配置
2. WordPress のフォルダ構成:
```
/var/www/wordpress/
├── wp-load.php
├── wp-admin/
├── wp-content/
└── wordpress-add-posts.php  ← ここに配置
```

### 記事が表示されない

**原因**: GraphQL が有効になっていない

**対処法**:
1. WPGraphQL プラグインを確認: **プラグイン** → **インストール済み**
2. 有効化されているか確認
3. `WORDPRESS_SETUP.md` の functions.php 設定を確認

---

## 🛡️ セキュリティに関する注意

- このスクリプトは **本番環境では使用後に削除** してください
- 管理者権限が必要です
- 記事追加後は、スクリプトは不要になるため削除推奨

```bash
# スクリプト削除
rm wordpress-add-posts.php
```

---

## 📚 関連ドキュメント

- `WORDPRESS_SETUP.md` - WordPress 全体の設定ガイド
- `DEPLOY.md` - デプロイメントガイド
- `README.md` - プロジェクト概要

---

## 💡 記事のカスタマイズ

`wordpress-add-posts.php` を編集することで、記事の内容をカスタマイズできます。

**編集方法:**

```php
$sample_posts = [
    [
        'post_title' => 'あなたのタイトル',
        'post_content' => 'あなたのコンテンツ',
        'post_category' => ['カテゴリ名'],
        'post_tags' => ['タグ1', 'タグ2'],
    ],
    // ... 他の記事
];
```

HTML タグも使用可能です:

```html
<h2>見出し</h2>
<p>段落</p>
<ul>
  <li>リスト項目</li>
</ul>
```

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. **WordPress バージョン**: 5.0以上推奨
2. **PHP バージョン**: 7.2以上推奨
3. **プラグイン**: WPGraphQL が有効か確認
4. **関数**: `wp_insert_post()` が利用可能か確認

