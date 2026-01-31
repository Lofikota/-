export interface DiaryEntry {
  id: string;
  date: string;
  fact: string;
  feeling: string;
  thought: string;
  draft: string;
  createdAt: Date;
}

export interface PerspectiveResponse {
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

export interface ValueTag {
  id: string;
  label: string;
  diaryId: string;
  createdAt: Date;
}

export type InputType = 'fact' | 'feeling' | 'thought' | 'draft';

export const INPUT_LABELS: Record<InputType, { title: string; placeholder: string }> = {
  fact: {
    title: 'Fact（起きたこと）',
    placeholder: '今日何があった？具体的な出来事を書いてみて。',
  },
  feeling: {
    title: 'Feeling（感情・違和感）',
    placeholder: 'そのとき、どんな気持ちだった？',
  },
  thought: {
    title: 'Thought（考え・解釈）',
    placeholder: 'なぜそう感じたと思う？自分なりの解釈は？',
  },
  draft: {
    title: 'Draft（仮説）',
    placeholder: 'この出来事から見えてきたことは？',
  },
};

export const PERSPECTIVE_CARDS = {
  A: { label: '前提の揺さぶり', question: '当たり前だと思っている前提は何？' },
  B: { label: '対立仮説', question: '別の説明があるとしたら何？' },
  C: { label: '価値観の衝突', question: '何が守られなかった？（尊重／自由／公平／成長／安心 など）' },
  D: { label: '期待のズレ', question: '本当は何を期待していた？' },
  E: { label: '恐れの正体', question: '失うのが怖かったものは何？' },
  F: { label: 'コントロール境界', question: '自分が変えられること／変えられないことはどこ？' },
  G: { label: '関係性の視点', question: '相手は何を守ろうとしていた可能性がある？' },
  H: { label: '再現条件', question: '同じことが起きる条件は何？' },
  I: { label: '反転テスト', question: '友達が同じ状況なら、あなたは何と言う？' },
  J: { label: '時間軸', question: '1週間後／1年後でも重要？それはなぜ？' },
  K: { label: '代替行動', question: '次回、"1つだけ"変えるなら何？' },
} as const;
