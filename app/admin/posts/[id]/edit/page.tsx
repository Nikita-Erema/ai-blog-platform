import { notFound } from 'next/navigation';
import { getPostById, updatePostAction } from '@/app/actions/posts';
import PostForm from '../../PostForm';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  const { id } = await params;
  const searchParamsResolved = await searchParams;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    'use server';
    await updatePostAction(id, formData);
  }

  const error = searchParamsResolved.error;
  const errorMessage =
    error === 'title_required'
      ? 'Title is required'
      : error === 'slug_required'
        ? 'Slug is required'
        : error === 'content_required'
          ? 'Content is required'
          : error === 'slug_exists'
            ? 'Slug already exists'
            : error === 'update_failed'
              ? `Failed to update post: ${searchParamsResolved.message || 'Unknown error'}`
              : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
      {errorMessage && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}
      <PostForm initialData={post} action={handleUpdate} />
    </div>
  );
}
