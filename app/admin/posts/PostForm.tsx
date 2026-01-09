'use client';

import { useTransition, useState } from 'react';
import type { Post } from '@/app/actions/posts';
import { generateExcerptAction, rewritePostAction, generatePostContentAction } from '@/app/actions/ai';

interface PostFormProps {
  initialData?: Post;
  action: (formData: FormData) => Promise<void>;
}

export default function PostForm({ initialData, action }: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  
  const isEditMode = !!initialData;
  const isContentEmpty = !content || !content.trim();

  return (
    <form
      action={async (formData) => {
        startTransition(async () => {
          await action(formData);
        });
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={initialData?.title || ''}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          required={isEditMode}
          defaultValue={initialData?.slug || ''}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {initialData && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <button
              type="button"
              onClick={async () => {
                if (!initialData) return;
                setIsGeneratingExcerpt(true);
                try {
                  const contentInput = document.getElementById('content') as HTMLTextAreaElement;
                  const content = contentInput?.value || initialData.content;
                  const generatedExcerpt = await generateExcerptAction(initialData.id, content);
                  setExcerpt(generatedExcerpt);
                } catch (error) {
                  alert(error instanceof Error ? error.message : 'Failed to generate excerpt');
                } finally {
                  setIsGeneratingExcerpt(false);
                }
              }}
              disabled={isGeneratingExcerpt || isPending}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isGeneratingExcerpt ? 'Generating...' : 'Generate Excerpt'}
            </button>
          </div>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="flex gap-2">
            {initialData && isContentEmpty && (
              <button
                type="button"
                onClick={async () => {
                  if (!initialData) return;
                  setIsGeneratingContent(true);
                  try {
                    const titleInput = document.getElementById('title') as HTMLInputElement;
                    const title = titleInput?.value || initialData.title;
                    const generatedContent = await generatePostContentAction(initialData.id, title);
                    setContent(generatedContent);
                  } catch (error) {
                    alert(error instanceof Error ? error.message : 'Failed to generate content');
                  } finally {
                    setIsGeneratingContent(false);
                  }
                }}
                disabled={isGeneratingContent || isPending}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isGeneratingContent ? 'Generating...' : 'Generate Content with AI'}
              </button>
            )}
            {initialData && !isContentEmpty && (
              <button
                type="button"
                onClick={async () => {
                  if (!initialData) return;
                  setIsRewriting(true);
                  try {
                    const contentInput = document.getElementById('content') as HTMLTextAreaElement;
                    const currentContent = contentInput?.value || initialData.content;
                    const rewrittenContent = await rewritePostAction(initialData.id, currentContent);
                    setContent(rewrittenContent);
                  } catch (error) {
                    alert(error instanceof Error ? error.message : 'Failed to rewrite content');
                  } finally {
                    setIsRewriting(false);
                  }
                }}
                disabled={isRewriting || isPending}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isRewriting ? 'Rewriting...' : 'Rewrite with AI'}
              </button>
            )}
          </div>
        </div>
        <textarea
          id="content"
          name="content"
          required={isEditMode}
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={initialData?.published || false}
          disabled={isPending}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          Published
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending
            ? initialData
              ? 'Updating...'
              : 'Creating...'
            : initialData
              ? 'Update Post'
              : 'Create Post'}
        </button>
        <a
          href="/admin/posts"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
