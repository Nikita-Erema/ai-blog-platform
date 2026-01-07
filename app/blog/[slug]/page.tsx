import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data для демонстрации
const mockPosts: Record<string, { title: string; content: string; date: string }> = {
  'getting-started-with-nextjs': {
    title: 'Getting Started with Next.js',
    content: `
      <p>Next.js is a React framework that enables you to build full-stack web applications.</p>
      <p>In this post, we'll explore the basics of Next.js and how to get started with your first project.</p>
      <h2>Installation</h2>
      <p>To create a new Next.js app, run:</p>
      <pre><code>npx create-next-app@latest</code></pre>
      <p>This will set up everything you need to start building your application.</p>
    `,
    date: '2024-01-15',
  },
  'introduction-to-typescript': {
    title: 'Introduction to TypeScript',
    content: `
      <p>TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.</p>
      <p>It adds static type definitions to JavaScript, which helps catch errors early in development.</p>
      <h2>Why TypeScript?</h2>
      <p>TypeScript provides better tooling, improved code quality, and enhanced developer experience.</p>
    `,
    date: '2024-01-10',
  },
  'tailwind-css-best-practices': {
    title: 'Tailwind CSS Best Practices',
    content: `
      <p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs quickly.</p>
      <h2>Best Practices</h2>
      <ul>
        <li>Use consistent spacing and sizing</li>
        <li>Extract common patterns into components</li>
        <li>Use the @apply directive sparingly</li>
        <li>Keep your utility classes organized</li>
      </ul>
    `,
    date: '2024-01-05',
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = mockPosts[slug];

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
          <p className="mt-4 text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString('en-US', {
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
