# お問い合わせフォーム作成プロンプト

このプロンプトをAIアシスタントに提供することで、同様のお問い合わせフォームを別プロジェクトでも作成できます。

---

## プロンプト

```
Next.jsでお問い合わせフォームを作成してください。以下の要件に従って実装をお願いします。

### 技術スタック
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Nodemailer (Gmail SMTP)

### ページ構成

#### 1. レイアウト
- Header コンポーネント（サイト共通）
- メインコンテンツエリア（最大幅800px、中央配置）
- Footer コンポーネント（サイト共通）
- 背景色: 白

#### 2. フォーム要素
以下の3つの入力フィールドを含むフォームを作成:

**お名前フィールド:**
- type: text
- 必須項目（赤い*印を表示）
- プレースホルダー: "山田太郎"

**メールアドレスフィールド:**
- type: email
- 必須項目（赤い*印を表示）
- プレースホルダー: "example@email.com"
- メールアドレス形式の検証

**お問い合わせ内容フィールド:**
- textarea (8行)
- 必須項目（赤い*印を表示）
- プレースホルダー: "お問い合わせ内容をご記入ください"

#### 3. 送信ボタン
- 全幅ボタン
- 赤色背景 (#dc2626 / red-600)
- ホバー時: より濃い赤 (#b91c1c / red-700)
- 送信中は無効化し、テキストを"送信中..."に変更
- フォーカス時: リング表示

#### 4. フィードバック表示
- 成功時: 緑色の背景 (bg-green-50) に緑色のテキスト (text-green-800)
- エラー時: 赤色の背景 (bg-red-50) に赤色のテキスト (text-red-800)
- 改行を保持 (whitespace-pre-line)
- 中央揃え

#### 5. 補足情報セクション
フォーム下部に灰色の背景（bg-gray-50）で以下の注意事項を表示:
- "お問い合わせ内容の確認後、担当者よりご連絡させていただきます。"
- "回答までに数日お時間をいただく場合がございます。"
- "土日祝日のお問い合わせは、翌営業日以降の対応となります。"

### デザイン要件

#### カラースキーム
- プライマリカラー: 赤色 (#dc2626)
- テキスト: グレー (#111827 / gray-900)
- ボーダー: ライトグレー (#d1d5db / gray-300)
- 背景: 白 (#ffffff)
- アクセント背景: ライトグレー (#f9fafb / gray-50)

#### スペーシング
- ページ上下パディング: 48px (py-12)
- フォーム内要素の間隔: 24px (space-y-6)
- フォームパディング: 32px (p-8)
- 最大幅: 800px

#### ボーダーとシャドウ
- フォームコンテナ: 角丸 (rounded-lg)、ボーダー (border-gray-200)、軽いシャドウ (shadow-sm)
- 入力フィールド: 角丸 (rounded-md)、ボーダー (border-gray-300)
- フォーカス時: 赤いリング (focus:ring-red-500)

### 機能要件

#### フロントエンド (app/contact/page.tsx)
1. **状態管理:**
   - formData: { name, email, message }
   - isSubmitting: 送信中フラグ
   - submitMessage: フィードバックメッセージ
   - submitStatus: 'success' | 'error' | null

2. **バリデーション:**
   - 全フィールド必須
   - メールアドレスの形式チェック（HTML5標準のtype="email"）

3. **送信処理:**
   - fetch('/api/contact', { method: 'POST', ... })
   - Content-Type: 'application/json; charset=utf-8'
   - 成功時: フォームをリセット、成功メッセージ表示
   - エラー時: エラーメッセージ表示（詳細があれば含める）

4. **ログ出力:**
   - console.log で送信データ、レスポンスステータス、レスポンスデータを記録

#### バックエンド (app/api/contact/route.ts)
1. **環境変数:**
   - EMAIL_USER: 送信元Gmailアドレス
   - EMAIL_PASS: Gmailアプリパスワード（16文字）
   - EMAIL_TO: 送信先メールアドレス

2. **バリデーション:**
   - 必須フィールドチェック
   - メールアドレス正規表現検証: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - 環境変数の存在確認

3. **メール送信 (Nodemailer):**
   - サービス: gmail
   - 認証: user/pass
   - TLS: rejectUnauthorized: false
   - Reply-To: 送信者のメールアドレスに設定

4. **メールテンプレート:**

   **件名:**
   ```
   【お問い合わせ】{name} 様より
   ```

   **テキスト版:**
   ```
   お名前: {name}
   メールアドレス: {email}

   お問い合わせ内容:
   {message}

   ---
   このメールは {サイト名} のお問い合わせフォームから送信されました。
   ```

   **HTML版:**
   - meta charset="UTF-8"
   - 日本語フォント: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif
   - 最大幅600px、中央配置
   - 白い背景カード（padding: 30px、border-radius: 8px、shadow）
   - 見出しに赤いボーダー（#dc2626）
   - お名前とメールアドレスを横並び表示（ラベル幅140px）
   - メールアドレスはクリッカブルリンク（赤色）
   - お問い合わせ内容は灰色背景（#f5f5f5）のボックスに表示
   - white-space: pre-wrap で改行保持
   - フッターに小さな注記（font-size: 12px、color: #999）

5. **エラーハンドリング:**
   - try-catch でエラーをキャッチ
   - console.error で詳細ログ出力
   - 開発環境のみエラー詳細を返す（process.env.NODE_ENV === 'development'）
   - 本番環境ではユーザーフレンドリーなエラーメッセージのみ

6. **レスポンス:**
   - 成功時: { success: true, message: '...', messageId: '...' }, status: 200
   - エラー時: { success: false, error: '...', details: '...' }, status: 400/500

### 環境設定

#### .env.local
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_TO=destination@gmail.com
```

#### package.json
```json
{
  "dependencies": {
    "nodemailer": "^7.0.10"
  },
  "devDependencies": {
    "@types/nodemailer": "^7.0.3"
  }
}
```

### その他の要件
- 'use client' ディレクティブを使用（クライアントコンポーネント）
- レスポンシブデザイン（モバイル対応）
- アクセシビリティ: label要素とhtmlFor属性を適切に使用
- TypeScript型安全性を確保
- コンソールログで十分なデバッグ情報を出力

### Gmailアプリパスワードの取得方法
1. Googleアカウントで2段階認証を有効化
2. https://myaccount.google.com/apppasswords にアクセス
3. アプリパスワードを生成（16文字）
4. スペースを除いてEMAIL_PASSに設定

### Vercelデプロイ時の注意
1. Vercelダッシュボード → Settings → Environment Variables
2. EMAIL_USER、EMAIL_PASS、EMAIL_TO を全環境（Production, Preview, Development）に追加
3. 環境変数追加後は必ずRedeployを実行

上記の要件に基づいて、以下のファイルを作成してください:
1. app/contact/page.tsx - フロントエンドUI
2. app/api/contact/route.ts - バックエンドAPI

コードは完全に動作する状態で、日本語のコメントを含めてください。
```

---

## 使い方

1. **このプロンプトをコピー**
2. **AIアシスタント（Claude Code など）に貼り付け**
3. **サイト名などをカスタマイズ**（必要に応じて）
4. **実装を依頼**

### カスタマイズポイント

プロンプトの以下の部分を、プロジェクトに応じて変更してください:

#### サイト名
```
このメールは {サイト名} のお問い合わせフォームから送信されました。
```
↓
```
このメールは マイプロジェクト のお問い合わせフォームから送信されました。
```

#### カラースキーム
プライマリカラーを変更する場合:
```
- プライマリカラー: 赤色 (#dc2626)
```
↓
```
- プライマリカラー: 青色 (#2563eb)
```

対応するTailwindクラスも変更:
- `bg-red-600` → `bg-blue-600`
- `hover:bg-red-700` → `hover:bg-blue-700`
- `focus:ring-red-500` → `focus:ring-blue-500`
- `text-red-600` → `text-blue-600`

#### フィールドのカスタマイズ
フィールドを追加する場合（例: 電話番号）:

```
**電話番号フィールド:**
- type: tel
- 任意項目
- プレースホルダー: "090-1234-5678"
```

#### 送信先メールアドレス
複数の宛先に送信する場合:
```
- EMAIL_TO: "email1@example.com,email2@example.com"
```

---

## 実装例

このプロンプトから生成される実装例は、以下のファイルで確認できます:

- **フロントエンド**: `app/contact/page.tsx`
- **API**: `app/api/contact/route.ts`
- **詳細ドキュメント**: `docs/email-implementation.md`

---

## チェックリスト

プロンプトを使用する前に確認:

- [ ] Next.js 16+ プロジェクトが存在する
- [ ] Tailwind CSS がインストール済み
- [ ] Header と Footer コンポーネントが存在する（または作成する）
- [ ] Gmailアカウントが準備できている
- [ ] 2段階認証を有効化できる
- [ ] Vercelにデプロイする場合は環境変数設定の準備

---

**作成日**: 2025-11-13
**用途**: AI生成による問い合わせフォームの再現
**対象**: Next.js + TypeScript + Nodemailer プロジェクト
