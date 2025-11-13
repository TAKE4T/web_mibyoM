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
