# Next.js メール送信機能の実装ガイド

このドキュメントでは、Next.js + Nodemailer + Gmail を使用したお問い合わせフォームのメール送信機能の実装方法を説明します。

## 目次

1. [概要](#概要)
2. [必要なパッケージ](#必要なパッケージ)
3. [環境変数の設定](#環境変数の設定)
4. [Gmail設定](#gmail設定)
5. [API Route実装](#api-route実装)
6. [フロントエンド実装](#フロントエンド実装)
7. [Vercelデプロイ設定](#vercelデプロイ設定)
8. [トラブルシューティング](#トラブルシューティング)

---

## 概要

この実装では、Next.js App Routerを使用して、お問い合わせフォームからのメールをGmail SMTP経由で送信します。

### 主な特徴

- ✅ UTF-8エンコーディングで日本語対応
- ✅ HTMLメールテンプレート
- ✅ Reply-To設定で返信が簡単
- ✅ バリデーションとエラーハンドリング
- ✅ Vercel対応

---

## 必要なパッケージ

### インストール

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### package.json

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

---

## 環境変数の設定

### `.env.local`（ローカル開発用）

```bash
# メール設定
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_TO=destination@gmail.com
```

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `EMAIL_USER` | 送信元Gmailアドレス | take4.farm@gmail.com |
| `EMAIL_PASS` | Gmailアプリパスワード（16文字） | abcdefghijklmnop |
| `EMAIL_TO` | 送信先メールアドレス | take4.farm@gmail.com |

---

## Gmail設定

### 1. 2段階認証を有効にする

1. https://myaccount.google.com/security にアクセス
2. 対象のGmailアカウントでログイン
3. 「2段階認証プロセス」をクリック
4. 画面の指示に従って有効化

### 2. アプリパスワードを生成

1. https://myaccount.google.com/apppasswords にアクセス
2. 「アプリを選択」→「その他（名前を入力）」
3. 任意の名前を入力（例: コアランゲージハブ）
4. 「生成」ボタンをクリック
5. **16文字のパスワード**が表示されます

   ```
   例: abcd efgh ijkl mnop
   ```

6. スペースを除いて`.env.local`に設定:

   ```bash
   EMAIL_PASS=abcdefghijklmnop
   ```

⚠️ **注意**: このパスワードは一度しか表示されません。必ずコピーして保存してください。

---

## API Route実装

### `app/api/contact/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('=== お問い合わせAPI開始 ===');

    const { name, email, message } = await request.json();
    console.log('受信したデータ:', { name, email, messageLength: message?.length });

    // バリデーション
    if (!name || !email || !message) {
      console.log('エラー: 必須フィールドが空');
      return NextResponse.json(
        { error: '全てのフィールドを入力してください' },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('エラー: メールアドレスの形式が不正');
      return NextResponse.json(
        { error: 'メールアドレスの形式が正しくありません' },
        { status: 400 }
      );
    }

    // 環境変数チェック
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('エラー: メール設定が未設定');
      console.error('EMAIL_USER:', process.env.EMAIL_USER ? '設定済み' : '未設定');
      console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '設定済み' : '未設定');
      return NextResponse.json(
        { error: 'メール送信設定が完了していません。管理者にお問い合わせください。' },
        { status: 500 }
      );
    }

    console.log('メール送信準備中...');
    console.log('送信元:', process.env.EMAIL_USER);
    console.log('送信先:', process.env.EMAIL_TO || 'デフォルト設定');

    // Nodemailerトランスポーター設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // メール本文作成
    const mailOptions = {
      from: {
        name: 'コア・ランゲージ・ハブ お問い合わせ',
        address: process.env.EMAIL_USER,
      },
      to: process.env.EMAIL_TO || 'take4.farm@gmail.com',
      replyTo: email, // 返信先を送信者のメールアドレスに設定
      subject: `【お問い合わせ】${name} 様より`,
      text: `
お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}

---
このメールは コア・ランゲージ・ハブ のお問い合わせフォームから送信されました。
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 0;">
                お問い合わせ
              </h2>

              <div style="margin: 20px 0;">
                <p style="margin: 10px 0;">
                  <strong style="color: #666; display: inline-block; width: 140px;">お名前:</strong>
                  <span>${name}</span>
                </p>
                <p style="margin: 10px 0;">
                  <strong style="color: #666; display: inline-block; width: 140px;">メールアドレス:</strong>
                  <span><a href="mailto:${email}" style="color: #dc2626; text-decoration: none;">${email}</a></span>
                </p>
              </div>

              <div style="margin: 20px 0;">
                <strong style="color: #666; display: block; margin-bottom: 10px;">お問い合わせ内容:</strong>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">
${message}
                </div>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

              <p style="font-size: 12px; color: #999; margin: 10px 0;">
                このメールは コア・ランゲージ・ハブ のお問い合わせフォームから送信されました。<br>
                返信する場合は、上記のメールアドレス宛に送信してください。
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('メール送信中...');

    // メール送信
    const info = await transporter.sendMail(mailOptions);

    console.log('メール送信成功:', info.messageId);
    console.log('=== お問い合わせAPI成功 ===');

    return NextResponse.json(
      {
        success: true,
        message: 'お問い合わせを受け付けました。ありがとうございます。',
        messageId: info.messageId,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('=== お問い合わせエラー詳細 ===');
    console.error('エラーメッセージ:', error);
    console.error('エラースタック:', error instanceof Error ? error.stack : 'スタックなし');

    // エラーの詳細を返す（開発環境のみ）
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';

    return NextResponse.json(
      {
        success: false,
        error: 'お問い合わせの送信に失敗しました',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
```

### 重要なポイント

1. **UTF-8エンコーディング**: nodemailerは自動的にUTF-8を使用します。`encoding`プロパティは不要です。

2. **Reply-To設定**: `replyTo: email` により、受信メールに返信すると自動的に送信者に届きます。

3. **HTMLメールテンプレート**:
   - 日本語フォント指定: `'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo`
   - `white-space: pre-wrap` で改行を保持

4. **エラーハンドリング**: 開発環境のみ詳細なエラーメッセージを返します。

---

## フロントエンド実装

### `app/contact/page.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus(null);

    try {
      console.log('お問い合わせ送信:', formData);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(formData),
      });

      console.log('レスポンスステータス:', response.status);
      const data = await response.json();
      console.log('レスポンスデータ:', data);

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('お問い合わせを受け付けました。ありがとうございます。');
        setFormData({ name: '', email: '', message: '' }); // フォームをリセット
      } else {
        setSubmitStatus('error');
        const errorMessage = data.error || 'お問い合わせの送信に失敗しました。';
        const details = data.details ? `\n詳細: ${data.details}` : '';
        setSubmitMessage(errorMessage + details);
        console.error('エラー詳細:', data);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('キャッチしたエラー:', error);
      setSubmitMessage(
        'エラーが発生しました。再度お試しください。\n' +
        (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[800px] px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">お問い合わせ</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* お名前 */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                お名前 <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="山田太郎"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                メールアドレス <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="example@email.com"
              />
            </div>

            {/* お問い合わせ内容 */}
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                お問い合わせ内容 <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={8}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="お問い合わせ内容をご記入ください"
              />
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </button>

            {/* 送信結果メッセージ */}
            {submitMessage && (
              <div
                className={`rounded-md p-4 text-center whitespace-pre-line ${
                  submitStatus === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-bold text-gray-900">お問い合わせについて</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• お問い合わせ内容の確認後、担当者よりご連絡させていただきます。</li>
            <li>• 回答までに数日お時間をいただく場合がございます。</li>
            <li>• 土日祝日のお問い合わせは、翌営業日以降の対応となります。</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

### UIのポイント

1. **状態管理**: `isSubmitting`, `submitStatus`, `submitMessage` で送信状態を管理
2. **フォームリセット**: 成功時に `setFormData({ name: '', email: '', message: '' })` でリセット
3. **エラー表示**: `whitespace-pre-line` で改行を保持したエラーメッセージ表示
4. **ボタン無効化**: `disabled={isSubmitting}` で多重送信を防止

---

## Vercelデプロイ設定

### 1. 環境変数を設定

Vercelダッシュボードで環境変数を追加します:

1. https://vercel.com にアクセス
2. プロジェクトを選択
3. **Settings** タブをクリック
4. 左サイドバーの **Environment Variables** をクリック
5. 以下の変数を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `EMAIL_USER` | your-email@gmail.com | Production, Preview, Development |
| `EMAIL_PASS` | 16文字のアプリパスワード | Production, Preview, Development |
| `EMAIL_TO` | destination@gmail.com | Production, Preview, Development |

⚠️ **注意**: `EMAIL_PASS` は必ず16文字のGmailアプリパスワードを使用してください。

### 2. 再デプロイ

環境変数を追加したら、再デプロイが必要です:

1. **Deployments** タブに移動
2. 最新のデプロイメントの右側にある **「...」** メニューをクリック
3. **Redeploy** を選択
4. **Redeploy** ボタンをクリック

---

## トラブルシューティング

### 問題1: メール送信に失敗する

**症状**: `お問い合わせの送信に失敗しました` エラーが表示される

**確認項目**:

1. ✅ `.env.local` に正しい環境変数が設定されているか
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=16文字のアプリパスワード
   EMAIL_TO=destination@gmail.com
   ```

2. ✅ Gmailアプリパスワードが正しいか
   - スペースを除いた16文字であることを確認
   - 2段階認証が有効になっているか確認

3. ✅ 開発サーバーを再起動したか
   ```bash
   npm run dev
   ```

**デバッグ方法**:

ブラウザの開発者ツール（F12）→ Consoleタブで詳細なエラーメッセージを確認:

```javascript
console.log('お問い合わせ送信:', formData);
console.log('レスポンスステータス:', response.status);
console.log('レスポンスデータ:', data);
```

サーバーログ（ターミナル）でも確認:

```bash
=== お問い合わせAPI開始 ===
受信したデータ: { name: '山田太郎', email: 'test@example.com', messageLength: 100 }
メール送信準備中...
送信元: take4.farm@gmail.com
送信先: take4.farm@gmail.com
メール送信中...
メール送信成功: <message-id@gmail.com>
=== お問い合わせAPI成功 ===
```

---

### 問題2: TypeScriptエラー: `encoding` プロパティの型エラー

**症状**: Vercelビルド時に以下のエラーが発生:

```
Type 'string' is not assignable to type 'TextEncoding | undefined'.
```

**解決方法**:

`mailOptions` から `encoding` と `textEncoding` プロパティを削除してください:

```typescript
// ❌ 削除する
const mailOptions = {
  // ...
  encoding: 'utf-8',
  textEncoding: 'quoted-printable',
};

// ✅ 正しい
const mailOptions = {
  from: { name: '...', address: '...' },
  to: '...',
  subject: '...',
  text: '...',
  html: '...',
};
```

nodemailerは自動的にUTF-8エンコーディングを使用するため、これらのプロパティは不要です。

---

### 問題3: 日本語が文字化けする

**症状**: 受信メールの日本語が文字化けしている

**解決方法**:

1. ✅ HTMLメールテンプレートに `<meta charset="UTF-8">` が含まれているか確認
   ```html
   <head>
     <meta charset="UTF-8">
   </head>
   ```

2. ✅ 日本語フォントが指定されているか確認
   ```css
   font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
   ```

3. ✅ `mailOptions` から不要な `encoding` プロパティを削除

---

### 問題4: Vercel環境変数が反映されない

**症状**: Vercelにデプロイ後、メール送信が動作しない

**解決方法**:

1. ✅ 環境変数を追加した後、必ず**Redeploy**を実行
2. ✅ 環境変数が全ての環境（Production, Preview, Development）に設定されているか確認
3. ✅ Vercelの **Deployments** タブで最新のデプロイメントのログを確認:
   ```
   Environment Variables
   ✓ EMAIL_USER
   ✓ EMAIL_PASS
   ✓ EMAIL_TO
   ```

---

### 問題5: Gmail「安全性の低いアプリ」エラー

**症状**: `Error: Invalid login: 535-5.7.8 Username and Password not accepted`

**解決方法**:

通常のGmailパスワードではなく、**アプリパスワード**を使用してください:

1. https://myaccount.google.com/apppasswords
2. 新しいアプリパスワードを生成
3. `.env.local` と Vercelの環境変数を更新

⚠️ **注意**: 2段階認証が無効の場合は、まず有効にする必要があります。

---

## まとめ

この実装により、以下の機能が実現できます:

- ✅ お問い合わせフォームからのメール送信
- ✅ UTF-8エンコーディングで日本語対応
- ✅ HTMLメールでリッチな表示
- ✅ Reply-To設定で簡単に返信
- ✅ バリデーションとエラーハンドリング
- ✅ Vercelでの本番環境デプロイ

### チェックリスト

- [ ] nodemailerパッケージをインストール
- [ ] Gmail 2段階認証を有効化
- [ ] Gmailアプリパスワードを生成
- [ ] `.env.local` に環境変数を設定
- [ ] API Route (`app/api/contact/route.ts`) を実装
- [ ] フロントエンド (`app/contact/page.tsx`) を実装
- [ ] ローカルでテスト
- [ ] Vercel環境変数を設定
- [ ] Vercelで再デプロイ
- [ ] 本番環境でテスト

---

**作成日**: 2025-11-13
**バージョン**: 1.0.0
