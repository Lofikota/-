"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface DiaryEntry {
  id: string;
  date: string;
  fact: string;
  feeling: string;
  thought: string;
  draft: string;
}

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

// モック: 視点生成のサンプルデータ
function generateMockPerspective(entry: DiaryEntry): PerspectiveData {
  return {
    acceptance: `${entry.fact ? entry.fact.slice(0, 30) + "..." : "それ"}が起きて、${
      entry.feeling ? entry.feeling.slice(0, 20) + "..." : "複雑な気持ち"
    }を感じたんだね。`,
    confirmQuestion:
      "一番引っかかったのは「出来事そのもの」より「そのときの自分の反応」？",
    perspectives: [
      {
        type: "D",
        label: "期待のズレ",
        content: "本当は何を期待していた？",
      },
      {
        type: "C",
        label: "価値観の衝突",
        content: "何が守られなかった？（尊重／自由／公平／成長／安心 など）",
      },
      {
        type: "F",
        label: "コントロール境界",
        content: "自分が変えられること／変えられないことはどこ？",
      },
    ],
    deepQuestion: "この出来事で「考えが止まった瞬間」はどこ？",
    valueTag: "自分のペースを守ること",
  };
}

export default function PerspectivePage() {
  const router = useRouter();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [perspective, setPerspective] = useState<PerspectiveData | null>(null);
  const [confirmAnswer, setConfirmAnswer] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("current-entry");
    if (stored) {
      const parsedEntry = JSON.parse(stored) as DiaryEntry;
      setEntry(parsedEntry);
      // モック: 視点生成（実際はAI APIを呼び出す）
      const mockPerspective = generateMockPerspective(parsedEntry);
      setPerspective(mockPerspective);

      // Supabaseに視点データを保存
      if (parsedEntry.id) {
        supabase
          .from("perspectives")
          .insert({
            diary_entry_id: parsedEntry.id,
            acceptance: mockPerspective.acceptance,
            confirm_question: mockPerspective.confirmQuestion,
            perspectives: mockPerspective.perspectives,
            deep_question: mockPerspective.deepQuestion,
            value_tag: mockPerspective.valueTag,
          })
          .then(({ error }) => {
            if (error) console.error("Error saving perspective:", error);
          });
      }
    } else {
      router.push("/write");
    }
  }, [router]);

  const handleGoToDeepDive = () => {
    if (perspective) {
      localStorage.setItem("current-perspective", JSON.stringify(perspective));
    }
    router.push("/deep-dive");
  };

  if (!entry || !perspective) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* ヘッダー */}
      <header className="mb-6">
        <Link
          href="/write"
          className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center gap-1 mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          視点を受け取る
        </h1>
      </header>

      {/* 1) 受容 */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">受容</p>
            <p className="text-slate-800 dark:text-slate-100">
              了解。{perspective.acceptance}
            </p>
          </div>
        </div>
      </section>

      {/* 2) 確認質問 */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center flex-shrink-0">
            <span className="text-rose-600 dark:text-rose-400 text-sm font-bold">2</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">確認質問</p>
            <p className="text-slate-800 dark:text-slate-100 mb-3">
              {perspective.confirmQuestion}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmAnswer("yes")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  confirmAnswer === "yes"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmAnswer("no")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  confirmAnswer === "no"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3) 視点の投入 */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">3</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">視点の投入</p>
            <div className="space-y-4">
              {perspective.perspectives.map((p, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded">
                      {p.type}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {p.label}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {p.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 深掘りへ進むボタン */}
      <button
        onClick={handleGoToDeepDive}
        className="w-full py-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors active:scale-[0.98] mb-4"
      >
        深掘り質問に向き合う
      </button>

      {/* 注意書き */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          ※ 結論や教訓は出していません。問いと視点のみを提示しています。抽象化はあなた自身が行います。
        </p>
      </div>
    </div>
  );
}
