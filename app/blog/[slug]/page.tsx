import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/app/actions/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Blog Platform
            </Link>
            <nav className="flex gap-4">
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900"
              >
                Blog
              </Link>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link
            href="/blog"
            className="mb-4 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Blog
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-xl text-gray-600">{post.excerpt}</p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
