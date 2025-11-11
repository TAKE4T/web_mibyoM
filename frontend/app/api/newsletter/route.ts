import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // バリデーション
    if (!email) {
      return NextResponse.json({ error: 'メールアドレスを入力してください' }, { status: 400 });
    }

    // トランスポーター設定 (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // メールオプション
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'take4.farm@gmail.com',
      subject: `メルマガ登録: ${email}`,
      text: `新しいメルマガ登録: ${email}`,
      html: `<p>新しいメルマガ登録: <strong>${email}</strong></p>`,
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'メルマガ登録が完了しました' }, { status: 200 });
  } catch (error) {
    console.error('メルマガ登録エラー:', error);
    return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 });
  }
}
