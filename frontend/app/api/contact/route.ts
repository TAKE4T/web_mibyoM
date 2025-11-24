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
        name: 'おてまえ文庫 お問い合わせ',
        address: process.env.EMAIL_USER,
      },
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email, // 返信先を送信者のメールアドレスに設定
      subject: `【お問い合わせ】${name} 様より`,
      text: `
お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}

---
このメールは おてまえ文庫 のお問い合わせフォームから送信されました。
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
                このメールは おてまえ文庫 のお問い合わせフォームから送信されました。<br>
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
