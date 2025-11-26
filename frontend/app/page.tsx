import Link from 'next/link';
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
  // Build feature sections — match by slug only. Ensure tags use English slugs.
  const featureSections = featureTags.map((tag) => ({
    ...tag,
    posts: posts
      .filter((post) => post.tags?.nodes.some((node) => node.slug === tag.slug))
      .slice(0, 3),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* メインコンテンツエリア */}
          <div className="lg:col-span-9">
            {/* トップ記事 */}
            {topPost && (
              <section className="mb-6">
                <ArticleCard post={topPost} layout="large" priority />
              </section>
            )}

            {/* 注目の記事（トップ記事の次、2-4件目） */}
            {posts.slice(1, 4).length > 0 && (
              <section className="mb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {posts.slice(1, 4).map((post) => (
                    <ArticleCard key={post.id} post={post} layout="small" />
                  ))}
                </div>
              </section>
            )}

            {/* セクション見出し */}
            {mainPosts.length > 0 && (
              <div className="mb-4 border-b-2 border-red-600 pb-2">
                <h2 className="text-lg font-bold text-gray-900">未病レポート</h2>
              </div>
            )}

            {/* メイン記事グリッド */}
            {mainPosts.length > 0 && (
              <section className="mb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mainPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} layout="medium" />
                  ))}
                </div>
              </section>
            )}

            {/* 他の記事セクション */}
            <section className="mb-6">
              <div className="mb-4 border-b-2 border-red-600 pb-2">
                <h2 className="text-lg font-bold text-gray-900">セルフケアヒント</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(21, 27).map((post) => (
                  <ArticleCard key={post.id} post={post} layout="medium" />
                ))}
              </div>
            </section>

            {/* 特集セクション（タグ別） */}
            {featureSections.some((section) => section.posts.length > 0) && (
              <section className="mb-6">
                <div className="mb-4 border-b-2 border-red-600 pb-2">
                  <h2 className="text-lg font-bold text-gray-900">特集ナビ</h2>
                </div>
                <div className="space-y-8">
                  {featureSections.map((section) => {
                    if (section.posts.length === 0) return null;
                    return (
                      <div key={section.slug}>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-3">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-600">{section.description}</p>
                          </div>
                          <Link
                            href={`/tag/${section.slug}`}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            もっと見る →
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>

          {/* サイドバー */}
          <aside className="lg:col-span-3">
            <div className="space-y-6">
              {/* ランキング */}
              <div className="border border-gray-200 bg-white">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <h3 className="text-base font-bold text-gray-900">未病トレンドランキング</h3>
                </div>
                <div className="p-4">
                  {rankingPosts.length > 0 ? (
                    <div className="space-y-4">
                      {rankingPosts.map((post, index) => (
                        <ArticleCard
                          key={post.id}
                          post={post}
                          layout="list"
                          showImage={false}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">記事がありません</p>
                  )}
                </div>
              </div>

              {/* カテゴリー */}
              {categories.length > 0 && (
                <div className="border border-gray-200 bg-white">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <h3 className="text-base font-bold text-gray-900">ナビゲーション</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {categories.slice(0, 10).map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/category/${category.slug}`}
                            className="flex items-center justify-between text-sm text-gray-700 hover:text-red-600 transition-colors"
                          >
                            <span>{category.name}</span>
                            <span className="text-xs text-gray-400">({category.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* バナー広告エリア（非表示） */}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
