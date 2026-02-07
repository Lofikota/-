-- perspectives テーブル: 日記エントリーに対する視点データ
create table if not exists perspectives (
  id uuid default gen_random_uuid() primary key,
  diary_entry_id uuid references diary_entries(id) on delete cascade,
  acceptance text not null,
  confirm_question text not null,
  perspectives jsonb not null default '[]',
  deep_question text not null,
  value_tag text not null,
  created_at timestamptz default now()
);

-- value_tags テーブル: 価値観辞書
create table if not exists value_tags (
  id uuid default gen_random_uuid() primary key,
  diary_entry_id uuid references diary_entries(id) on delete set null,
  label text not null,
  answer text,
  created_at timestamptz default now()
);

-- インデックス
create index if not exists idx_perspectives_diary_entry_id on perspectives(diary_entry_id);
create index if not exists idx_value_tags_created_at on value_tags(created_at desc);

-- RLS（Row Level Security）を有効化
alter table perspectives enable row level security;
alter table value_tags enable row level security;

-- 匿名ユーザーの読み書きを許可（認証未実装のため）
create policy "Allow anonymous read perspectives" on perspectives for select using (true);
create policy "Allow anonymous insert perspectives" on perspectives for insert with check (true);

create policy "Allow anonymous read value_tags" on value_tags for select using (true);
create policy "Allow anonymous insert value_tags" on value_tags for insert with check (true);
create policy "Allow anonymous delete value_tags" on value_tags for delete using (true);
