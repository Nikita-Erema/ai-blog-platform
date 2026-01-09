import PostCreateForm from './PostCreateForm';

interface NewPostPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const params = await searchParams;
  const error = params.error;

  const errorMessage =
    error === 'title_required'
      ? 'Title is required'
      : error === 'content_required'
        ? 'Content is required'
        : error === 'create_failed'
          ? `Failed to create post: ${params.message || 'Unknown error'}`
          : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
      {errorMessage && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}
      <PostCreateForm />
    </div>
  );
}
