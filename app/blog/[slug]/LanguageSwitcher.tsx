'use client';

import { useState } from 'react';
import Link from 'next/link';
import { translatePost, translateExcerpt } from '@/app/actions/ai';
import { formatDate } from '@/lib/date';

interface LanguageSwitcherProps {
  postId: string;
  originalContent: string;
  originalExcerpt: string | null;
  postTitle: string;
  postCreatedAt: string;
}

export default function LanguageSwitcher({ postId, originalContent, originalExcerpt, postTitle, postCreatedAt }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState<'original' | 'en' | 'ru'>('original');
  const [content, setContent] = useState(originalContent);
  const [excerpt, setExcerpt] = useState<string | null>(originalExcerpt);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (lang: 'original' | 'en' | 'ru') => {
    if (lang === currentLang) return;

    if (lang === 'original') {
      setContent(originalContent);
      setExcerpt(originalExcerpt);
      setCurrentLang('original');
      return;
    }

    setIsLoading(true);
    try {
      const [translatedContent, translatedExcerptText] = await Promise.all([
        translatePost(postId, originalContent, lang),
        originalExcerpt ? translateExcerpt(postId, originalExcerpt, lang) : Promise.resolve(null),
      ]);
      setContent(translatedContent);
      setExcerpt(translatedExcerptText);
      setCurrentLang(lang);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to translate:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-12">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          ← Back to Blog
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {postTitle}
        </h1>
        {excerpt && (
          <p className="mb-6 text-xl leading-relaxed text-gray-600">
            {excerpt}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {formatDate(postCreatedAt)}
        </p>
      </header>
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => handleLanguageChange('original')}
          disabled={isLoading}
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            currentLang === 'original'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Original
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          disabled={isLoading}
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            currentLang === 'en'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('ru')}
          disabled={isLoading}
          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            currentLang === 'ru'
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          RU
        </button>
        {isLoading && (
          <span className="flex items-center px-4 py-2 text-sm text-gray-500">
            Translating...
          </span>
        )}
      </div>
      <div
        className="prose prose-lg prose-gray max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-gray-900 prose-a:underline prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-50"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
