import { getPostStats } from '@/app/actions/posts';

export default async function AdminPage() {
  const stats = await getPostStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Welcome to the admin panel. Here you can manage your blog posts.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Posts</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="mt-1 text-sm text-gray-500">Total posts</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Published</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.published}</p>
          <p className="mt-1 text-sm text-gray-500">Published posts</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Drafts</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.drafts}</p>
          <p className="mt-1 text-sm text-gray-500">Draft posts</p>
        </div>
      </div>
    </div>
  );
}
