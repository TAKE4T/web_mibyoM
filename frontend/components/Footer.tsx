import Link from 'next/link';

const navigationLinks = [
  { label: 'オンライン保険調剤', href: '/category/online-dispensing' },
  { label: '東洋薬学', href: '/category/eastern-pharmacy' },
  { label: '西洋薬学', href: '/category/western-pharmacy' },
  { label: '未病とは', href: '/category/what-is-mibyo' },
  { label: 'カラダの仕組み', href: '/category/body-science' },
  { label: '学び', href: '/category/learning' },
  { label: '書籍紹介', href: '/category/book-review' },
  { label: 'イベント・マルシェ', href: '/category/events-marche' },
];

const featureLinks = [
  { label: '毎日の食事', href: '/tag/everyday-meals' },
  { label: '運動の理屈', href: '/tag/exercise-principles' },
  { label: '睡眠ナビ', href: '/tag/sleep-navigation' },
  { label: '和韓蒸しとは', href: '/tag/wa-kan-steam' },
  { label: '頭皮ケア特集', href: '/tag/scalp-care' },
  { label: '肌ケアとは', href: '/tag/skin-care' },
  { label: '腸活ブームを振り返る', href: '/tag/gut-brain-health' },
  { label: '幹細胞治療最前線', href: '/tag/stem-cell-frontier' },
  { label: 'コーヒー豆を科学する', href: '/tag/coffee-science' },
];

const aboutLinks = [
  { label: 'おてまえ文庫とは？', href: '/about' },
  { label: '運営会社', href: '/company' },
  { label: 'ショップ', href: '/shop' },
  { label: '特定商取引法に基づく表示', href: '/law' },
  { label: '個人情報保護方針', href: '/privacy' },
  { label: 'お問い合わせ', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-300 bg-gray-100 mt-12">
      <div className="mx-auto max-w-[1200px] px-4">
        {/* メインフッター */}
        <div className="grid grid-cols-2 gap-8 py-8 text-xs md:grid-cols-4">
          <div>
            <h3 className="mb-3 font-bold text-gray-900">ナビゲーション</h3>
            <ul className="space-y-2">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-600 hover:text-red-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-gray-900">特集で探す</h3>
            <ul className="space-y-2">
              {featureLinks.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-600 hover:text-red-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-gray-900">深掘りガイド</h3>
            <ul className="space-y-2">
              {featureLinks.slice(6).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-600 hover:text-red-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-bold text-gray-900">運営情報</h3>
            <ul className="space-y-2">
              {aboutLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-600 hover:text-red-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ソーシャルメディア & コピーライト */}
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex gap-4">
              <a href="https://www.instagram.com" className="text-gray-500 hover:text-gray-700" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm12 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12zm-6 3.5A5.5 5.5 0 1 0 18.5 13 5.5 5.5 0 0 0 13 7.5zm0 2A3.5 3.5 0 1 1 9.5 13 3.5 3.5 0 0 1 13 9.5zm5.75-3.25a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
                </svg>
              </a>
              <a href="https://www.youtube.com" className="text-gray-500 hover:text-gray-700" aria-label="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.8c.2.9.9 1.6 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15V9l5 3-5 3z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-gray-500">
              &copy; {currentYear} おてまえ文庫. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
