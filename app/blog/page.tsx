import Link from 'next/link';
import { getPublishedPosts } from '@/app/actions/posts';
import { formatDate } from '@/lib/date';

export default async function BlogPage() {
  const posts = await getPublishedPosts().catch(() => []);

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
                href="/"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Home
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
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Blog Posts
        </h1>
        {posts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">No published posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                <h2 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mb-4 text-base leading-relaxed text-gray-600">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {formatDate(post.created_at)}
                  </p>
                  <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

