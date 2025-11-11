import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/wordpress';

interface ArticleCardProps {
  post: Post;
  priority?: boolean;
  layout?: 'large' | 'medium' | 'small' | 'list';
  showImage?: boolean;
  rank?: number;
}

export default function ArticleCard({
  post,
  priority = false,
  layout = 'medium',
  showImage = true,
  rank
}: ArticleCardProps) {
  // GraphQL形式のデータから画像URLを取得
  const imageUrl = post.featuredImage?.node?.sourceUrl || '/placeholder-image.jpg';
  const categories = post.categories?.nodes || [];
  const mainCategory = categories[0];

  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });

  // HTMLタグを除去して抜粋を取得（最大100文字）
  const getPlainTextExcerpt = (excerpt: string, maxLength: number = 100) => {
    const plainText = excerpt.replace(/<[^>]*>/g, '').trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  // 著者名を取得（無い場合はデフォルト）
  const authorName = post.author?.node?.name || 'おてまえ未病ハブ編集部';

  // リストレイアウト（サイドバー用）
  if (layout === 'list') {
    return (
      <Link href={`/posts/${post.slug}`} className="group block border-b border-gray-200 pb-3 last:border-0">
        <article className="flex gap-2">
          {rank && (
            <span className="text-lg font-bold text-red-600 flex-shrink-0 w-6">
              {rank}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-2 text-sm leading-snug text-gray-900 group-hover:text-red-600 transition-colors">
              {post.title}
            </h3>
            <time className="text-xs text-gray-500 mt-1 block">{formattedDate}</time>
          </div>
        </article>
      </Link>
    );
  }

  // 小サイズカード
  if (layout === 'small') {
    return (
      <Link href={`/posts/${post.slug}`} className="group block">
        <article className="border border-gray-200 bg-white hover:shadow-md transition-all">
          {showImage && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.featuredImage?.node?.altText || post.title}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-3">
            {mainCategory && (
              <span className="inline-block mb-1 text-xs text-red-600 font-medium">
                {mainCategory.name}
              </span>
            )}
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-red-600 transition-colors mb-1">
              {post.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-1">
              {getPlainTextExcerpt(post.excerpt)}
            </p>
            <p className="text-xs text-gray-400">{authorName}</p>
          </div>
        </article>
      </Link>
    );
  }

  // 中サイズカード
  if (layout === 'medium') {
    return (
      <Link href={`/posts/${post.slug}`} className="group block">
        <article className="border border-gray-200 bg-white hover:shadow-md transition-all">
          {showImage && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.featuredImage?.node?.altText || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority={priority}
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            {mainCategory && (
              <span className="inline-block mb-2 text-xs text-red-600 font-medium">
                {mainCategory.name}
              </span>
            )}
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 group-hover:text-red-600 transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {getPlainTextExcerpt(post.excerpt)}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{authorName}</span>
              <time className="text-gray-500">{formattedDate}</time>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // 大サイズカード（トップ記事用）
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="border border-gray-200 bg-white hover:shadow-lg transition-all">
        {showImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.featuredImage?.node?.altText || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority={priority}
              className="object-cover"
            />
          </div>
        )}
        <div className="p-5">
          {mainCategory && (
            <span className="inline-block mb-2 text-sm text-red-600 font-bold">
              {mainCategory.name}
            </span>
          )}
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-gray-900 group-hover:text-red-600 transition-colors mb-3">
            {post.title}
          </h3>
          <div className="line-clamp-2 text-sm text-gray-600 mb-3">
            {getPlainTextExcerpt(post.excerpt)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{authorName}</span>
            <time className="text-gray-500">{formattedDate}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
