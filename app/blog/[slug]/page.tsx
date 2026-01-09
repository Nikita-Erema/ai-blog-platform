import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/app/actions/posts';
import type { Metadata } from 'next';
import { formatDate } from '@/lib/date';
import LanguageSwitcher from './LanguageSwitcher';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const postUrl = `${baseUrl}/blog/${slug}`;

  const title = post.seo_title_en || post.seo_title || post.title;
  const description = post.seo_description_en || post.seo_description || post.excerpt || '';

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: postUrl,
      languages: {
        'en': postUrl,
        'ru': postUrl,
        'x-default': postUrl,
      },
    },
  };

  if (!post.published) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Blog Platform
            </Link>
            <nav className="flex gap-3">
              <Link
                href="/blog"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/admin"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <LanguageSwitcher postId={post.id} originalContent={post.content} originalExcerpt={post.excerpt} postTitle={post.title} postCreatedAt={post.created_at} />
      </article>
    </div>
  );
}
