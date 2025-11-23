import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getCategories } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60; // ISR: 60秒ごとに再生成

export default async function Home() {
  // 記事とカテゴリーを取得
  const { posts, total } = await getPosts({ perPage: 30 });
  const categories = await getCategories();
  const featureTags = [
    { slug: 'everyday-meals', title: '毎日の食事', description: '症状別で選ぶ理想の食事とレシピ' },
    { slug: 'exercise-principles', title: '運動の理屈', description: '目的別の運動計画と体の使い方' },
    { slug: 'sleep-navigation', title: '睡眠ナビ', description: '悩み別の休息アプローチ' },
    { slug: 'wa-kan-steam', title: '和韓蒸しとは', description: '蒸気療法と巡りケアの最前線' },
    { slug: 'scalp-care', title: '頭皮ケア特集', description: '髪の変化を生む頭皮環境の整え方' },
    { slug: 'skin-care', title: '肌ケアとは', description: 'お肌を守る最新の素材と成分' },
    { slug: 'gut-brain-health', title: '腸活ブームを振り返る', description: '腸脳相関を流行で終わらせない' },
    { slug: 'stem-cell-frontier', title: '幹細胞治療最前線', description: '細胞を目覚めさせる医療のいま' },
    { slug: 'coffee-science', title: 'コーヒー豆を科学する', description: '焙煎と産地で叶える体調別ブレンド' },
  ];

  // デバッグ情報（開発環境のみ）
  if (process.env.NODE_ENV === 'development') {
    console.log('WordPress GraphQL URL:', process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL);
    console.log('取得した記事数:', posts.length, '/ 合計:', total);
    console.log('カテゴリー数:', categories.length);
  }

  // 記事がない場合の警告
  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-bold text-yellow-900">記事が見つかりません</h2>
            <p className="text-yellow-800">WordPressに記事を追加してください。</p>
            <p className="mt-2 text-sm text-yellow-700">
              GraphQL URL: {process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || '未設定'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // トップ記事（1件）
  const topPost = posts[0];

  // メイン記事（5-16件目）
  const mainPosts = posts.slice(4, 16);

  // ランキング記事（トップ5の最新記事）
  const rankingPosts = posts.slice(0, 5);

  // 特集セクション（タグ連動）
  const featureSections = featureTags.map((tag) => ({
    ...tag,
    posts: posts
      .filter((post) => post.tags?.nodes.some((node) => node.slug === tag.slug))
      .slice(0, 3),
  }));

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-12">
        {/* Hero Section */}
        {topPost && (
          <section className="relative">
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={topPost.featuredImage?.node?.sourceUrl || '/placeholder-image.jpg'}
                alt={topPost.featuredImage?.node?.altText || topPost.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                <div className="max-w-2xl">
                  {topPost.categories?.nodes?.[0] && (
                    <span className="inline-block mb-2 text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      {topPost.categories.nodes[0].name}
                    </span>
                  )}
                  <h1 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-4">
                    {topPost.title}
                  </h1>
                  <p className="text-lg md:text-xl opacity-90 line-clamp-2">
                    {topPost.excerpt.replace(/<[^>]*>/g, '').trim()}
                  </p>
                  <Link
                    href={`/posts/${topPost.slug}`}
                    className="inline-block mt-4 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                  >
                    続きを読む
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Navigation */}
        <section className="text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8">カテゴリで探す</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="/category/work" className="group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-sm md:text-base">Work</span>
              </div>
            </Link>
            <Link href="/category/life" className="group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-sm md:text-base">Life</span>
              </div>
            </Link>
            <Link href="/category/money" className="group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-sm md:text-base">Money</span>
              </div>
            </Link>
            <Link href="/category/love" className="group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-sm md:text-base">Love</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Feature Banner */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">未病レポート</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            最新の未病に関する記事をお届けします。健康維持のためのヒントや最新情報をチェックしましょう。
          </p>
        </section>

        {/* Latest Articles */}
        {posts.slice(1, 9).length > 0 && (
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8 text-center">最新記事</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.slice(1, 9).map((post) => (
                <ArticleCard key={post.id} post={post} layout="medium" />
              ))}
            </div>
          </section>
        )}

        {/* Ranking Section */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">未病トレンドランキング</h2>
          <div className="space-y-4">
            {rankingPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-teal-500 w-8 text-center">{index + 1}</span>
                <div className="flex-1">
                  <Link href={`/posts/${post.slug}`} className="group block">
                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {post.excerpt.replace(/<[^>]*>/g, '').trim()}
                    </p>
                  </Link>
                </div>
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      fill
                      sizes="64px"
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Feature Sections */}
        {featureSections.some((section) => section.posts.length > 0) && (
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8 text-center">特集ナビ</h2>
            <div className="space-y-12">
              {featureSections.map((section) => {
                if (section.posts.length === 0) return null;
                return (
                  <div key={section.slug}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-gray-800">{section.title}</h3>
                        <p className="text-gray-600 mt-1">{section.description}</p>
                      </div>
                      <Link
                        href={`/tag/${section.slug}`}
                        className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        もっと見る →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.posts.map((post) => (
                        <ArticleCard key={post.id} post={post} layout="medium" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
