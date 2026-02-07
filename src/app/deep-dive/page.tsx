"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PerspectiveData {
  acceptance: string;
  confirmQuestion: string;
  perspectives: {
    type: string;
    label: string;
    content: string;
  }[];
  deepQuestion: string;
  valueTag: string;
}

export default function DeepDivePage() {
  const router = useRouter();
  const [perspective, setPerspective] = useState<PerspectiveData | null>(null);
  const [answer, setAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("current-perspective");
    if (stored) {
      setPerspective(JSON.parse(stored) as PerspectiveData);
    } else {
      router.push("/write");
    }
  }, [router]);

  const handleSaveValueTag = async () => {
    if (!perspective) return;

    setIsSaving(true);

    // Supabaseに価値観タグを保存
    const entryData = localStorage.getItem("current-entry");
    const diaryEntryId = entryData ? JSON.parse(entryData).id : null;

    const { error } = await supabase.from("value_tags").insert({
      label: perspective.valueTag,
      answer: answer || null,
      diary_entry_id: diaryEntryId,
    });

    if (error) {
      console.error("Error saving value tag:", error);
      setIsSaving(false);
      return;
    }

    // 完了後、辞書画面へ
    router.push("/dictionary");
  };

  if (!perspective) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* ヘッダー */}
      <header className="mb-6">
        <Link
          href="/perspective"
          className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center gap-1 mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          深掘り質問
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          核となる1つの問いに向き合う
        </p>
      </header>

      {/* 4) 深掘り質問 */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-sm font-bold">4</span>
          </div>
          <p className="text-indigo-100 text-sm">深掘り質問</p>
        </div>
        <p className="text-white text-xl font-medium leading-relaxed">
          {perspective.deepQuestion}
        </p>
      </section>

      {/* 回答入力エリア */}
      <section className="mb-6">
        <label className="block mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            あなたの考え（任意）
          </span>
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="この問いについて、今思うことを書いてみて..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors resize-none"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          ※ 書かなくてもOK。頭の中で考えるだけでも価値があります。
        </p>
      </section>

      {/* 5) 価値観辞書への採集 */}
      <section className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-700 dark:text-amber-300 text-sm font-bold">5</span>
          </div>
          <div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
              価値観辞書への採集
            </p>
            <p className="text-amber-800 dark:text-amber-200 font-medium">
              「{perspective.valueTag}」
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              を大事にしている可能性があるかもしれない。
            </p>
          </div>
        </div>
      </section>

      {/* アクションボタン */}
      <div className="space-y-3">
        <button
          onClick={handleSaveValueTag}
          disabled={isSaving}
          className="w-full py-4 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? "保存中..." : "価値観辞書に追加する"}
        </button>
        <Link
          href="/"
          className="block w-full py-4 rounded-xl font-semibold text-center text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          追加せずにホームへ戻る
        </Link>
      </div>
    </div>
  );
}
