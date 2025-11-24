# 認証機能セットアップガイド

このガイドでは、Google認証とメール認証（パスワード + マジックリンク）の設定方法を解説します。

## 目次

1. [データベースのセットアップ](#データベースのセットアップ)
2. [Google OAuth設定](#google-oauth設定)
3. [環境変数の設定](#環境変数の設定)
4. [メール送信設定](#メール送信設定)
5. [データベースマイグレーション](#データベースマイグレーション)
6. [動作確認](#動作確認)

---

## データベースのセットアップ

### 選択肢1: Vercel Postgres（推奨）

Vercelの無料プランで使用できるPostgreSQLデータベースです。

1. [Vercel Dashboard](https://vercel.com)にアクセス
2. プロジェクトを選択
3. 「Storage」タブをクリック
4. 「Create Database」→「Postgres」を選択
5. データベース名を入力して作成
6. 「.env.local」タブをクリック
7. `DATABASE_URL`をコピー

### 選択肢2: Supabase（推奨）

無料で使えるPostgreSQLデータベースです。

1. [Supabase](https://supabase.com)にサインアップ
2. 新規プロジェクトを作成
3. プロジェクト設定 → Database → Connection string
4. `postgres://`で始まるURLをコピー

### 選択肢3: Railway

開発環境に最適です。

1. [Railway](https://railway.app)にサインアップ
2. 「New Project」→「Provision PostgreSQL」
3. データベースを選択 → 「Connect」タブ
4. `DATABASE_URL`をコピー

### 選択肢4: ローカルPostgreSQL

```bash
# Dockerを使用する場合
docker run --name postgres-auth \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=authdb \
  -p 5432:5432 \
  -d postgres

# 接続URL
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/authdb"
```

---

## Google OAuth設定

### ステップ1: Google Cloud Consoleでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新規プロジェクトを作成（例: otemae-mibyo-hub-auth）
3. プロジェクトを選択

### ステップ2: OAuth同意画面の設定

1. 左メニュー → **「APIとサービス」→「OAuth同意画面」**
2. **外部**を選択 → 「作成」
3. 必要項目を入力:
  - アプリ名: `おてまえ文庫`
   - ユーザーサポートメール: あなたのメール
   - デベロッパーの連絡先情報: あなたのメール
4. 「保存して次へ」
5. スコープは設定不要 → 「保存して次へ」
6. テストユーザーを追加（オプション）
7. 「保存して次へ」

### ステップ3: 認証情報の作成

1. 左メニュー → **「APIとサービス」→「認証情報」**
2. 「認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前: `Next.js Auth`
5. **承認済みのリダイレクトURI**に以下を追加:

```
# ローカル開発用
http://localhost:3000/api/auth/callback/google

# 本番環境用（Vercel URLに置き換え）
https://your-app.vercel.app/api/auth/callback/google
```

6. 「作成」をクリック
7. **クライアントID**と**クライアントシークレット**をコピー

---

## 環境変数の設定

### ローカル環境（.env.local）

`.env.local`ファイルに以下を追加:

```bash
# 既存のWordPress設定
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://wpmibyo.otemae-osu.com/graphql

# データベース
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# メール送信（Gmail推奨）
EMAIL_SERVER="smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587"
EMAIL_FROM="your-email@gmail.com"
```

### NEXTAUTH_SECRETの生成

```bash
# Linuxまたは Mac
openssl rand -base64 32

# またはNode.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

生成された文字列をコピーして`NEXTAUTH_SECRET`に設定。

### 本番環境（Vercel）

1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. 以下を追加:

| Name | Value |
|------|-------|
| `DATABASE_URL` | （データベースの接続URL） |
| `NEXTAUTH_URL` | `https://mibyo.otemae-osu.com` または Vercel URL |
| `NEXTAUTH_SECRET` | （生成したシークレット） |
| `GOOGLE_CLIENT_ID` | （Google OAuth クライアントID） |
| `GOOGLE_CLIENT_SECRET` | （Google OAuth シークレット） |
| `EMAIL_SERVER` | （SMTP接続文字列） |
| `EMAIL_FROM` | （送信元メールアドレス） |

---

## メール送信設定

### Gmailを使用する場合（推奨）

1. Googleアカウントで2段階認証を有効化
2. [アプリパスワード](https://myaccount.google.com/apppasswords)を生成
3. `.env.local`に設定:

```bash
EMAIL_SERVER="smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587"
EMAIL_FROM="your-email@gmail.com"
```

### Resendを使用する場合（推奨・本番向け）

1. [Resend](https://resend.com)にサインアップ（無料枠あり）
2. APIキーを取得
3. `.env.local`に設定:

```bash
EMAIL_SERVER="smtp://resend:your-api-key@smtp.resend.com:587"
EMAIL_FROM="noreply@your-domain.com"
```

---

## データベースマイグレーション

### ステップ1: Prismaクライアントの生成

```bash
npx prisma generate
```

### ステップ2: データベースマイグレーション

```bash
npx prisma migrate dev --name init
```

これにより、以下のテーブルが作成されます:

- `users` - ユーザー情報
- `accounts` - OAuth連携情報
- `sessions` - セッション情報
- `verification_tokens` - メール認証トークン

### ステップ3: Prisma Studioで確認（オプション）

```bash
npx prisma studio
```

ブラウザで`http://localhost:5555`を開いて、データベースを確認できます。

---

## 動作確認

### ステップ1: 開発サーバーを起動

```bash
npm run dev
```

### ステップ2: ログインページにアクセス

```
http://localhost:3000/login
```

### ステップ3: 認証をテスト

#### Google認証

1. 「Googleでログイン」ボタンをクリック
2. Googleアカウントを選択
3. 認証後、トップページにリダイレクト
4. ヘッダーにユーザー名が表示されることを確認

#### メールアドレス + パスワード

1. 「新規登録」タブをクリック
2. メールアドレスとパスワードを入力
3. 「登録」をクリック
4. ログインできることを確認

#### マジックリンク

1. 「パスワードを忘れた方」をクリック
2. メールアドレスを入力
3. 送信されたメールのリンクをクリック
4. 自動的にログインされることを確認

---

## トラブルシューティング

### データベース接続エラー

```
Error: P1001: Can't reach database server
```

**解決策:**
1. `DATABASE_URL`が正しいか確認
2. データベースサーバーが起動しているか確認
3. ネットワーク接続を確認

### Google OAuth エラー

```
Error: redirect_uri_mismatch
```

**解決策:**
1. Google Cloud Consoleで設定したリダイレクトURIが正しいか確認
2. `http://localhost:3000/api/auth/callback/google`が登録されているか確認

### メール送信エラー

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**解決策:**
1. Gmailのアプリパスワードを使用しているか確認
2. 2段階認証が有効化されているか確認
3. `EMAIL_SERVER`の形式が正しいか確認

### Prismaエラー

```
Error: @prisma/client did not initialize yet
```

**解決策:**
```bash
npx prisma generate
npm run dev
```

---

## 次のステップ

1. [ ] ユーザープロフィールページの作成
2. [ ] パスワードリセット機能の実装
3. [ ] メール確認機能の追加
4. [ ] ユーザー権限管理の実装

---

## 参考リンク

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

**最終更新:** 2025-11-10
