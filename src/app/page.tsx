"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DiaryEntry {
  id: string;
  created_at: string;
  content: {
    fact: string;
    feeling: string;
    thought: string;
    draft: string;
  };
}

export default function HomePage() {
  const [recentEntries, setRecentEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentEntries(data);
      }
      setLoading(false);
    };

    fetchEntries();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Perspective Coach
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          視点生成日記
        </p>
      </header>

      {/* 今日の日付 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">今日</p>
        <p className="text-lg font-medium text-slate-800 dark:text-slate-100 mt-1">
          {today}
        </p>
      </div>

      {/* 日記を書くCTA */}
      <Link
        href="/write"
        className="block bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-6 shadow-sm transition-colors mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">今日の日記を書く</p>
            <p className="text-indigo-200 text-sm mt-1">
              出来事と感情を言葉にしてみよう
            </p>
          </div>
          <svg
            className="w-6 h-6"
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
      </Link>

      {/* アプリの説明 */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 mb-6">
        <h2 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          このアプリについて
        </h2>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">1.</span>
            出来事・感情・考えを書く
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">2.</span>
            AIが結論ではなく「問い」を返す
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">3.</span>
            自分で考え抜き、価値観を発見する
          </li>
        </ul>
      </div>

      {/* 最近の日記 */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          最近の日記
        </h2>
        {loading ? (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">読み込み中...</p>
          </div>
        ) : recentEntries.length > 0 ? (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/diary/${entry.id}`}
                className="block bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(entry.created_at).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-slate-800 dark:text-slate-100 mt-1 line-clamp-2">
                  {entry.content?.fact || entry.content?.feeling || "（内容なし）"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              まだ日記がありません
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              最初の一歩を踏み出してみよう
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
