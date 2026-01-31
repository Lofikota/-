"use client";

import { useEffect, useState } from "react";

interface ValueTag {
  id: string;
  label: string;
  answer?: string;
  createdAt: string;
}

export default function DictionaryPage() {
  const [tags, setTags] = useState<ValueTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<ValueTag | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("value-tags");
    if (stored) {
      setTags(JSON.parse(stored) as ValueTag[]);
    }
  }, []);

  const handleDeleteTag = (id: string) => {
    const updatedTags = tags.filter((tag) => tag.id !== id);
    setTags(updatedTags);
    localStorage.setItem("value-tags", JSON.stringify(updatedTags));
    setSelectedTag(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* ヘッダー */}
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          価値観辞書
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          日記から発見した、あなたの大切にしていること
        </p>
      </header>

      {/* 統計 */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm">発見した価値観</p>
            <p className="text-white text-3xl font-bold mt-1">{tags.length}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* タグ一覧 */}
      {tags.length > 0 ? (
        <div className="space-y-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag)}
              className="w-full text-left bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 dark:text-amber-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {tag.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {formatDate(tag.createdAt)}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            まだ価値観がありません
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            日記を書いて、自分の価値観を発見しよう
          </p>
        </div>
      )}

      {/* 詳細モーダル */}
      {selectedTag && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setSelectedTag(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-t-3xl w-full max-w-md p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500 dark:text-amber-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {selectedTag.label}
              </h2>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              発見日: {formatDate(selectedTag.createdAt)}
            </p>

            {selectedTag.answer && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  そのときの考え
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedTag.answer}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTag(null)}
                className="flex-1 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                閉じる
              </button>
              <button
                onClick={() => handleDeleteTag(selectedTag.id)}
                className="py-3 px-4 rounded-xl font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
