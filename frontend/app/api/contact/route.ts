import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json({ error: '全てのフィールドを入力してください' }, { status: 400 });
    }

    // トランスポーター設定 (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // take4.farm@gmail.com
        pass: process.env.EMAIL_PASS, // Gmailアプリパスワード
      },
    });

    // メールオプション
    const mailOptions = {
      from: email, // 送信者
      to: 'take4.farm@gmail.com', // 受信者
      subject: `お問い合わせ: ${name} 様より`,
      text: `
お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}
      `,
      html: `
        <h2>お問い合わせ</h2>
        <p><strong>お名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'メールが送信されました' }, { status: 200 });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
  }
}
