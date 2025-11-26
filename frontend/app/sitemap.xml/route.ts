import { getPosts, getPages, getCategories, getTags } from '@/lib/wordpress';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mibyo.otemae-osu.com';

function formatDate(d?: string) {
  if (!d) return undefined;
  try {
    return new Date(d).toISOString();
  } catch (e) {
    return undefined;
  }
}

// Helper to fetch ALL posts by paging through getPosts
async function fetchAllPosts() {
  const perPage = 100;
  let page = 1;
  let all: any[] = [];

  while (true) {
    const { posts } = await getPosts({ perPage, page });
    if (!posts || posts.length === 0) break;
    all = all.concat(posts);
    if (posts.length < perPage) break;
    page++;
  }

  return all;
}

export async function GET() {
  try {
    // Collect routes
    const routes: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }> = [];

    // Static top-level pages
    const staticPages = ['/', '/contact', '/diagnosis', '/search'];
    staticPages.forEach((p) => {
      routes.push({ loc: `${SITE_URL}${p}`, changefreq: 'daily', priority: '0.8' });
    });

    // Pages (fixed pages from WP)
    const pages = await getPages();
    pages.forEach((page) => {
      routes.push({ loc: `${SITE_URL}/${page.slug}`, lastmod: formatDate(page.modified || page.date), changefreq: 'weekly', priority: '0.7' });
    });

    // Posts
    const posts = await fetchAllPosts();
    posts.forEach((post) => {
      routes.push({ loc: `${SITE_URL}/posts/${post.slug}`, lastmod: formatDate(post.modified || post.date), changefreq: 'weekly', priority: '0.9' });
    });

    // Categories
    const categories = await getCategories();
    categories.forEach((cat) => {
      routes.push({ loc: `${SITE_URL}/category/${cat.slug}`, changefreq: 'weekly', priority: '0.6' });
    });

    // Tags
    const tags = await getTags();
    tags.forEach((tag) => {
      routes.push({ loc: `${SITE_URL}/tag/${tag.slug}`, changefreq: 'weekly', priority: '0.6' });
    });

    // Deduplicate (keep latest lastmod when present)
    const map = new Map<string, { loc: string; lastmod?: string; changefreq?: string; priority?: string }>();
    for (const r of routes) {
      const existing = map.get(r.loc);
      if (!existing) {
        map.set(r.loc, r);
      } else {
        if (r.lastmod && (!existing.lastmod || r.lastmod > existing.lastmod)) {
          map.set(r.loc, { ...existing, lastmod: r.lastmod, changefreq: r.changefreq || existing.changefreq, priority: r.priority || existing.priority });
        }
      }
    }

    const finalRoutes = Array.from(map.values());

    // Build XML
    const urlsXml = finalRoutes
      .map((u) => {
        return `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ''}${u.priority ? `\n    <priority>${u.priority}</priority>` : ''}\n  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
