import Link from 'next/link';

// Mock data для демонстрации
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    slug: 'getting-started-with-nextjs',
    excerpt: 'Learn how to build modern web applications with Next.js and React.',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Introduction to TypeScript',
    slug: 'introduction-to-typescript',
    excerpt: 'Discover the benefits of TypeScript and how to use it in your projects.',
    date: '2024-01-10',
  },
  {
    id: '3',
    title: 'Tailwind CSS Best Practices',
    slug: 'tailwind-css-best-practices',
    excerpt: 'Learn the best practices for using Tailwind CSS in your projects.',
    date: '2024-01-05',
  },
];

export default function BlogPage() {
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
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Home
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Blog Posts</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
              <p className="mt-4 text-xs text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

