'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DiagnosisPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: 実際のAPI連携はここに実装
    // 現在は仮の処理
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[800px] px-4 py-12">
        {!isSubmitted ? (
          <>
            {/* ヘッダー */}
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                あなたの事業を「言語化」する
              </h1>
              <p className="text-lg text-gray-600">
                15分で完了する無料診断で、ビジネスを可視化します
              </p>
            </div>

            {/* 特徴 */}
            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-red-600">11</div>
                <div className="text-sm font-medium text-gray-900">フレームワーク</div>
                <div className="mt-2 text-xs text-gray-600">
                  リーンキャンバスを含む11の分析手法
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-red-600">29</div>
                <div className="text-sm font-medium text-gray-900">質問項目</div>
                <div className="mt-2 text-xs text-gray-600">
                  事業を多角的に分析する質問
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-red-600">14</div>
                <div className="text-sm font-medium text-gray-900">ページ</div>
                <div className="mt-2 text-xs text-gray-600">
                  専用レポートを郵送でお届け
                </div>
              </div>
            </div>

            {/* 診断内容 */}
            <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">診断内容</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">課題と前提条件の分析</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">ペルソナ設計</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">理想の未来の定義</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">解決策の設計</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">マーケティング戦略</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">業務プロセス分析</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">KPI設定</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">マネタイズ設計</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">原価企画</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">ストーリー設計</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">✓</span>
                  <span className="text-sm text-gray-700">デザイン設計</span>
                </div>
              </div>
            </div>

            {/* 登録フォーム */}
            <div className="rounded-lg border-2 border-red-600 bg-white p-8">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                無料診断に登録する
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    お名前 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="山田太郎"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
                    あなたの事業について簡単に教えてください <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="business"
                    name="business"
                    required
                    value={formData.business}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="例：BtoB向けのマーケティング支援サービスを提供しています"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    後ほど詳しくお伺いしますので、ここでは簡単にお書きください。
                  </p>
                </div>

                <div className="rounded bg-gray-50 p-4 text-xs text-gray-600">
                  <p className="mb-2">
                    <strong>次のステップ：</strong>
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>登録後、詳細な診断フォーム（29項目）へのリンクをメールでお送りします</li>
                    <li>フォーム送信後、AI分析を行います</li>
                    <li>10日間の個別メルマガが配信されます</li>
                    <li>約1週間で専用レポート（14ページ）を郵送いたします</li>
                  </ol>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded bg-red-600 py-4 text-lg font-bold text-white hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {isSubmitting ? '送信中...' : '無料診断に登録する'}
                </button>

                <p className="text-center text-xs text-gray-500">
                  登録することで、
                  <Link href="/privacy" className="text-red-600 hover:underline">プライバシーポリシー</Link>
                  と
                  <Link href="/terms" className="text-red-600 hover:underline">利用規約</Link>
                  に同意したものとみなされます。
                </p>
              </form>
            </div>
          </>
        ) : (
          /* 送信完了画面 */
          <div className="rounded-lg border border-green-200 bg-green-50 p-12 text-center">
            <div className="mb-4 text-6xl">✓</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              登録ありがとうございます！
            </h2>
            <p className="mb-6 text-gray-700">
              {formData.email} 宛に確認メールをお送りしました。
            </p>
            <div className="rounded bg-white p-6 text-left">
              <p className="mb-4 font-medium text-gray-900">次のステップ：</p>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                <li>メールをご確認ください（迷惑メールフォルダもご確認ください）</li>
                <li>メール内のリンクから詳細診断フォーム（29項目）にアクセス</li>
                <li>15分程度でフォームを完了</li>
                <li>AI分析後、個別メルマガが配信されます（10日間）</li>
                <li>約1週間で専用レポート（14ページ）をご自宅に郵送</li>
              </ol>
            </div>
            <Link
              href="/"
              className="mt-8 inline-block rounded bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition-colors"
            >
              トップページに戻る
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
