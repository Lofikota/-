"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const INPUT_FIELDS = [
  {
    key: "fact",
    title: "Fact（起きたこと）",
    placeholder: "今日何があった？具体的な出来事を書いてみて。",
    color: "indigo",
  },
  {
    key: "feeling",
    title: "Feeling（感情・違和感）",
    placeholder: "そのとき、どんな気持ちだった？",
    color: "rose",
  },
  {
    key: "thought",
    title: "Thought（考え・解釈）",
    placeholder: "なぜそう感じたと思う？自分なりの解釈は？",
    color: "emerald",
  },
  {
    key: "draft",
    title: "Draft（仮説）",
    placeholder: "この出来事から見えてきたことは？（任意）",
    color: "amber",
  },
] as const;

type FormData = {
  fact: string;
  feeling: string;
  thought: string;
  draft: string;
};

export default function WritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fact: "",
    feeling: "",
    thought: "",
    draft: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.fact && !formData.feeling && !formData.thought) {
      return;
    }

    setIsSubmitting(true);

    // Supabaseに保存
    const { data, error } = await supabase
      .from("diary_entries")
      .insert({
        content: formData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving entry:", error);
      setIsSubmitting(false);
      return;
    }

    // 視点提示画面用のデータをlocalStorageに保存（一時的）
    localStorage.setItem("current-entry", JSON.stringify({
      id: data.id,
      ...formData,
    }));

    router.push("/perspective");
  };

  const isValid = formData.fact || formData.feeling || formData.thought;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* ヘッダー */}
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          今日の日記を書く
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          出来事と感情を言葉にしてみよう
        </p>
      </header>

      {/* 入力フォーム */}
      <div className="space-y-6">
        {INPUT_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block mb-2">
              <span
                className={`text-sm font-semibold ${
                  field.color === "indigo"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : field.color === "rose"
                    ? "text-rose-600 dark:text-rose-400"
                    : field.color === "emerald"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {field.title}
              </span>
            </label>
            <textarea
              value={formData[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors resize-none ${
                field.color === "indigo"
                  ? "border-indigo-200 dark:border-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600"
                  : field.color === "rose"
                  ? "border-rose-200 dark:border-rose-800 focus:border-rose-400 dark:focus:border-rose-600"
                  : field.color === "emerald"
                  ? "border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-600"
                  : "border-amber-200 dark:border-amber-800 focus:border-amber-400 dark:focus:border-amber-600"
              }`}
            />
          </div>
        ))}
      </div>

      {/* 送信ボタン */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
            isValid && !isSubmitting
              ? "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
              : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "送信中..." : "視点を受け取る"}
        </button>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
          ※ AIは結論ではなく「問い」を返します
        </p>
      </div>
    </div>
  );
}
