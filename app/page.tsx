import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Blog Platform</h1>
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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Welcome to Blog Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A modern blog platform built with Next.js
          </p>
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              View Blog Posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
