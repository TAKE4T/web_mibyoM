# 東洋経済オンライン風デザインガイド

## デザインコンセプト

東洋経済オンラインのデザインを参考に、ビジネスメディアとして信頼性と読みやすさを重視した設計。

---

## カラースキーム

### メインカラー

| 用途 | カラー | 使用箇所 |
|------|--------|----------|
| **プライマリ** | 赤 (#DC2626) | CTA、リンクホバー、カテゴリーバッジ |
| **セカンダリ** | オレンジ (#F97316) | 会員登録ボタン |
| **テキスト** | ダークグレー (#333333) | 本文テキスト |
| **背景** | 白 (#FFFFFF) | 全体背景 |
| **境界線** | ライトグレー (#E5E7EB) | カード、セクション区切り |

### カラー使用例

```css
/* プライマリアクション */
bg-red-600 hover:bg-red-700

/* リンク */
text-gray-700 hover:text-red-600

/* カテゴリーバッジ */
text-red-600
```

---

## タイポグラフィ

### フォントスタック

```css
font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
             "Hiragino Kaku Gothic ProN", "Hiragino Sans",
             "メイリオ", Meiryo, sans-serif;
```

### フォントサイズ

| 要素 | サイズ | 用途 |
|------|--------|------|
| **本文** | 14px | 通常のテキスト |
| **記事タイトル（大）** | 20px-24px | トップ記事 |
| **記事タイトル（中）** | 16px | メイン記事 |
| **記事タイトル（小）** | 14px | サイドバー、リスト |
| **見出し** | 16-18px | セクション見出し |
| **メタ情報** | 12px | 日付、カテゴリー |

---

## レイアウト構成

### グリッドシステム

```
┌─────────────────────────────────────┐
│          ヘッダー (sticky)           │
├─────────────────────────┬───────────┤
│                         │           │
│   メインコンテンツ       │ サイド    │
│   (9カラム)             │ バー     │
│                         │ (3カラム) │
│   ┌───────────────┐     │           │
│   │トップ記事(大) │     │ ランキング│
│   └───────────────┘     │           │
│   ┌─┬─┬─┐             │ カテゴリー│
│   │特│特│特│             │           │
│   └─┴─┴─┘             │ CTA      │
│   ┌─┬─┬─┐             │           │
│   │ │ │ │             │ 広告      │
│   └─┴─┴─┘             │           │
│                         │           │
└─────────────────────────┴───────────┘
│            フッター                  │
└─────────────────────────────────────┘
```

### 最大幅

- **コンテナ**: `max-w-[1200px]` (1200px)
- **ヘッダー**: `max-w-[1200px]` (1200px)

---

## コンポーネント

### 1. ヘッダー

**特徴:**
- Sticky positioning (z-50)
- 3層構造（トップバー、メインヘッダー、ナビゲーション）
- 検索バーを中央配置

```tsx
<header className="sticky top-0 z-50 border-b bg-white shadow-sm">
  {/* トップバー: ログイン/会員登録 */}
  {/* メインヘッダー: ロゴ + 検索 + CTA */}
  {/* ナビゲーション: カテゴリーリンク */}
</header>
```

### 2. 記事カード

**4つのレイアウト:**

#### Large (トップ記事)
- 大きな画像 (16:9)
- タイトル: 20px
- 抜粋あり

#### Medium (メイン記事)
- 中サイズ画像 (16:9)
- タイトル: 16px
- 3カラムグリッド対応

#### Small (特集記事)
- 小サイズ画像 (16:9)
- タイトル: 14px
- コンパクト

#### List (ランキング)
- 画像なし
- ランキング番号表示
- タイトルのみ

```tsx
<ArticleCard
  post={post}
  layout="medium"
  showImage={true}
/>
```

### 3. サイドバー

**構成要素:**
1. アクセスランキング (1-10位)
2. カテゴリーリスト
3. CTA (事業診断)
4. 広告枠

**スタイリング:**
```tsx
<div className="border border-gray-200 bg-white">
  <div className="border-b bg-gray-50 px-4 py-3">
    <h3 className="font-bold">見出し</h3>
  </div>
  <div className="p-4">
    {/* コンテンツ */}
  </div>
</div>
```

---

## インタラクション

### ホバー効果

```css
/* リンク */
hover:text-red-600 transition-colors

/* カード */
hover:shadow-md transition-all

/* ボタン */
hover:bg-red-700 transition-colors
```

### トランジション

- デュレーション: 200ms (ease)
- プロパティ: color, background-color, box-shadow

---

## レスポンシブデザイン

### ブレークポイント

| サイズ | 幅 | レイアウト |
|--------|-----|-----------|
| **モバイル** | < 768px | 1カラム |
| **タブレット** | 768px - 1024px | 2カラム |
| **デスクトップ** | > 1024px | 3カラム (9+3) |

### モバイル最適化

```tsx
// ヘッダー検索: デスクトップのみ表示
<div className="hidden md:flex">

// 記事グリッド: レスポンシブ対応
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

---

## アクセシビリティ

### 基本ルール

1. **コントラスト比**: 4.5:1以上
2. **フォントサイズ**: 最小14px
3. **タップターゲット**: 最小44x44px
4. **セマンティックHTML**: 適切なタグ使用

### 実装例

```tsx
// 適切な見出し階層
<h1>サイトタイトル</h1>
<h2>セクション見出し</h2>
<h3>記事タイトル</h3>

// alt属性
<Image src={url} alt={title} />

// リンクテキスト
<Link href="/article">記事タイトル</Link>
```

---

## ベストプラクティス

### 1. パフォーマンス

- **画像最適化**: Next.js Image コンポーネント使用
- **遅延読み込み**: priority プロパティは初回表示のみ
- **ISR**: 60秒ごとに再生成

```tsx
export const revalidate = 60;
```

### 2. SEO

- **メタデータ**: generateMetadata 関数
- **構造化データ**: Schema.org
- **パンくずリスト**: 記事詳細ページ

### 3. コードスタイル

```tsx
// Tailwind クラスの順序
className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
//         ↑レイアウト ↑間隔 ↑装飾 ↑テキスト ↑インタラクション
```

---

## カスタマイズガイド

### サイト名変更

`components/Header.tsx`:
```tsx
<h1>東洋経済オンライン</h1>
↓
<h1>あなたのサイト名</h1>
```

### カラー変更

`components/ArticleCard.tsx`, `app/page.tsx`:
```tsx
// 赤 → 青に変更
text-red-600 → text-blue-600
bg-red-600 → bg-blue-600
hover:text-red-600 → hover:text-blue-600
```

### レイアウト調整

`app/page.tsx`:
```tsx
// 3カラム (9+3) → 2カラム (8+4) に変更
<div className="lg:col-span-9"> → <div className="lg:col-span-8">
<aside className="lg:col-span-3"> → <aside className="lg:col-span-4">
```

---

## トラブルシューティング

### スタイルが反映されない

```bash
# Tailwind キャッシュをクリア
cd frontend
rm -rf .next
npm run dev
```

### 画像が表示されない

`next.config.ts`でドメインを追加:
```ts
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'your-domain.com',
    }
  ]
}
```

### フォントが変わらない

ブラウザキャッシュをクリアして再読み込み (Ctrl + Shift + R)

---

## 参考リンク

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [東洋経済オンライン](https://toyokeizai.net/)
