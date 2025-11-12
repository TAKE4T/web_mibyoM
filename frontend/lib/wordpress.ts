import { GraphQLClient, gql } from 'graphql-request';
import https from 'https';

const GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://wpmibyo.otemae-osu.com/graphql';

const BASIC_AUTH_USER = process.env.WORDPRESS_GRAPHQL_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.WORDPRESS_GRAPHQL_BASIC_AUTH_PASSWORD;
const ALLOW_INSECURE_SSL = process.env.WORDPRESS_GRAPHQL_ALLOW_INSECURE_SSL === 'true';

const defaultHeaders: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (compatible; NextJS/16.0; +https://mibyo.otemae-osu.com)',
};

if (BASIC_AUTH_USER && BASIC_AUTH_PASSWORD) {
  const encodedCredentials = Buffer.from(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`).toString('base64');
  defaultHeaders.Authorization = `Basic ${encodedCredentials}`;
}

const insecureHttpsAgent =
  ALLOW_INSECURE_SSL && GRAPHQL_URL.startsWith('https://')
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

const fetchWithOptionalAgent: typeof fetch = insecureHttpsAgent
  ? (input, init = {}) => {
      const extendedInit = {
        ...init,
        agent: insecureHttpsAgent,
      } as RequestInit & { agent: https.Agent };
      return fetch(input, extendedInit);
    }
  : fetch;

// GraphQLクライアントの作成
const client = new GraphQLClient(GRAPHQL_URL, {
  headers: defaultHeaders,
  fetch: fetchWithOptionalAgent,
});

export interface Post {
  id: string;
  databaseId: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: string;
  content: string;
  excerpt: string;
  author?: {
    node: {
      id: string;
      name: string;
      avatar: {
        url: string;
      };
    };
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
  categories?: {
    nodes: Array<{
      id: string;
      databaseId: number;
      name: string;
      slug: string;
    }>;
  };
  tags?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

export interface Category {
  id: string;
  databaseId: number;
  count: number;
  description: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  databaseId: number;
  count: number;
  description: string;
  name: string;
  slug: string;
}

export interface Page {
  id: string;
  databaseId: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
}

/**
 * 記事一覧を取得
 */
export async function getPosts(params: {
  page?: number;
  perPage?: number;
  categories?: number[];
  search?: string;
} = {}): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  try {
    const { page = 1, perPage = 10, categories, search } = params;

    // カテゴリーIDをGraphQLの形式に変換
    const categoryIn = categories && categories.length > 0 ? categories : undefined;

    const query = gql`
      query GetPosts($first: Int!, $after: String, $categoryIn: [ID], $search: String) {
        posts(
          first: $first
          after: $after
          where: {
            categoryIn: $categoryIn
            search: $search
            status: PUBLISH
            orderby: { field: DATE, order: DESC }
          }
        ) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          nodes {
            id
            databaseId
            date
            modified
            slug
            status
            title
            content
            excerpt
            author {
              node {
                id
                name
                avatar {
                  url
                }
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
            categories {
              nodes {
                id
                databaseId
                name
                slug
              }
            }
            tags {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
    `;

    // ページネーション用のカーソル計算（簡易版）
    const after = page > 1 ? btoa(`arrayconnection:${(page - 1) * perPage - 1}`) : undefined;

    const data = await client.request<{ posts: { nodes: Post[] } }>(query, {
      first: perPage,
      after,
      categoryIn,
      search,
    });

    const posts = data.posts.nodes || [];

    // totalを取得（簡易版: 取得した投稿数をtotalとして使用）
    const total = posts.length;
    const totalPages = Math.ceil(total / perPage);

    console.log('GraphQL API URL:', GRAPHQL_URL);
    console.log('取得した記事数:', posts.length);

    return {
      posts,
      total,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return { posts: [], total: 0, totalPages: 0 };
  }
}

/**
 * 記事をスラッグで取得
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const query = gql`
      query GetPostBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          databaseId
          date
          modified
          slug
          status
          title
          content
          excerpt
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          categories {
            nodes {
              id
              databaseId
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    `;

    const data = await client.request<{ post: Post | null }>(query, { slug });
    return data.post || null;
  } catch (error) {
    console.error('Error fetching post by slug:', slug, error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    return null;
  }
}

/**
 * 記事をIDで取得
 */
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const query = gql`
      query GetPostById($id: ID!) {
        post(id: $id, idType: DATABASE_ID) {
          id
          databaseId
          date
          modified
          slug
          status
          title
          content
          excerpt
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          categories {
            nodes {
              id
              databaseId
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    `;

    const data = await client.request<{ post: Post | null }>(query, { id: id.toString() });
    return data.post || null;
  } catch (error) {
    console.error('Error fetching post by ID:', id, error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    return null;
  }
}

/**
 * カテゴリー一覧を取得
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const query = gql`
      query GetCategories {
        categories(first: 100, where: { hideEmpty: true }) {
          nodes {
            id
            databaseId
            count
            description
            name
            slug
          }
        }
      }
    `;

    const data = await client.request<{ categories: { nodes: Category[] } }>(query);
    return data.categories.nodes || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    return [];
  }
}

/**
 * 人気記事を取得（最新順）
 */
export async function getPopularPosts(limit: number = 5): Promise<Post[]> {
  try {
    const { posts } = await getPosts({ perPage: limit });
    return posts;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}

/**
 * タグ一覧を取得
 */
export async function getTags(): Promise<Tag[]> {
  try {
    const query = gql`
      query GetTags {
        tags(first: 100, where: { hideEmpty: true }) {
          nodes {
            id
            databaseId
            count
            description
            name
            slug
          }
        }
      }
    `;

    const data = await client.request<{ tags: { nodes: Tag[] } }>(query);
    return data.tags.nodes || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    return [];
  }
}

/**
 * 固定ページをスラッグで取得
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const query = gql`
      query GetPageBySlug($slug: ID!) {
        page(id: $slug, idType: URI) {
          id
          databaseId
          date
          modified
          slug
          status
          title
          content
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    `;

    const data = await client.request<{ page: Page | null }>(query, { slug });
    return data.page || null;
  } catch (error) {
    console.error('Error fetching page by slug:', slug, error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    return null;
  }
}

/**
 * 全固定ページを取得
 */
export async function getPages(): Promise<Page[]> {
  try {
    const query = gql`
      query GetPages {
        pages(first: 100, where: { status: PUBLISH }) {
          nodes {
            id
            databaseId
            date
            modified
            slug
            status
            title
            content
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        }
      }
    `;

    const data = await client.request<{ pages: { nodes: Page[] } }>(query);
    return data.pages.nodes || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    console.error('GraphQL URL:', GRAPHQL_URL);
    return [];
  }
}
