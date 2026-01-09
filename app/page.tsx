import Link from 'next/link';

export default function Home() {
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
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to Blog Platform
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A modern blog platform built with Next.js
          </p>
          <div className="mt-10">
            <Link
              href="/blog"
              className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors"
            >
              View Blog Posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
