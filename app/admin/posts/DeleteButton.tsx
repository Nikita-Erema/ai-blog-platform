'use client';

import { useTransition } from 'react';
import { deletePostAction } from '@/app/actions/posts';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  postId: string;
  postTitle: string;
}

export default function DeleteButton({ postId, postTitle }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePostAction(postId);
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete post');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="ml-4 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
