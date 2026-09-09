-- Mainlagi learning attempts + skill mastery
-- Additive migration: legacy game_sessions/game_scores/progress stay intact.

create table if not exists public.learning_skills (
  skill_key text primary key,
  subject_id text not null check (subject_id in ('bahasa','english','math','iqro','color')),
  title text not null,
  description text not null default '',
  domain text not null,
  age_min smallint not null check (age_min between 3 and 7),
  age_max smallint not null check (age_max between 3 and 7 and age_max >= age_min),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_activities (
  activity_id text primary key,
  subject_id text not null check (subject_id in ('bahasa','english','math','iqro','color')),
  stage_id text not null,
  runtime text not null,
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  assessment text not null default 'practice' check (assessment in ('assessed','practice')),
  required_for_stage boolean not null default true,
  motion_optional boolean not null default false,
  star_reward smallint not null default 0 check (star_reward between 0 and 20),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_activity_skills (
  activity_id text not null references public.learning_activities(activity_id) on delete cascade,
  skill_key text not null references public.learning_skills(skill_key) on delete cascade,
  evidence_weight numeric(6,3) not null default 1 check (evidence_weight > 0 and evidence_weight <= 3),
  primary key (activity_id, skill_key)
);

create table if not exists public.learning_attempts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null check (char_length(child_key) between 1 and 128),
  client_attempt_id text not null check (char_length(client_attempt_id) between 1 and 160),
  activity_id text not null references public.learning_activities(activity_id),
  subject_id text not null check (subject_id in ('bahasa','english','math','iqro','color')),
  stage_id text not null,
  runtime text not null,
  status text not null default 'completed' check (status in ('completed','abandoned','interrupted')),
  assessed boolean not null default false,
  score numeric(7,6) check (score is null or (score >= 0 and score <= 1)),
  accuracy numeric(7,6) check (accuracy is null or (accuracy >= 0 and accuracy <= 1)),
  correct_count integer not null default 0 check (correct_count >= 0),
  incorrect_count integer not null default 0 check (incorrect_count >= 0),
  hint_count integer not null default 0 check (hint_count >= 0),
  retry_count integer not null default 0 check (retry_count >= 0),
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  input_mode text,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (account_id, child_key, client_attempt_id)
);

create index if not exists idx_learning_attempts_child_time
  on public.learning_attempts(account_id, child_key, completed_at desc);
create index if not exists idx_learning_attempts_activity_time
  on public.learning_attempts(account_id, child_key, activity_id, completed_at desc);

create table if not exists public.learning_attempt_skill_evidence (
  attempt_id uuid not null references public.learning_attempts(id) on delete cascade,
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null,
  activity_id text not null,
  skill_key text not null references public.learning_skills(skill_key),
  evidence_score numeric(7,6) not null check (evidence_score >= 0 and evidence_score <= 1),
  evidence_weight numeric(7,4) not null check (evidence_weight > 0 and evidence_weight <= 4),
  qualifies_for_mastery boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (attempt_id, skill_key)
);
create index if not exists idx_learning_evidence_child_skill
  on public.learning_attempt_skill_evidence(account_id, child_key, skill_key, created_at desc);

create table if not exists public.child_skill_mastery (
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null,
  skill_key text not null references public.learning_skills(skill_key),
  mastery_score numeric(7,6) not null default 0 check (mastery_score >= 0 and mastery_score <= 1),
  confidence numeric(7,6) not null default 0 check (confidence >= 0 and confidence <= 1),
  mastery_level text not null default 'not_started' check (mastery_level in ('not_started','exploring','developing','proficient','mastered')),
  evidence_count integer not null default 0 check (evidence_count >= 0),
  qualifying_evidence_count integer not null default 0 check (qualifying_evidence_count >= 0),
  last_evidence_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (account_id, child_key, skill_key)
);

create table if not exists public.child_learning_progress (
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null,
  completed_activity_ids text[] not null default '{}',
  total_stars integer not null default 0 check (total_stars >= 0),
  last_activity_id text,
  updated_at timestamptz not null default now(),
  primary key (account_id, child_key)
);

create table if not exists public.child_learning_achievements (
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null,
  achievement_key text not null,
  awarded_at timestamptz not null default now(),
  evidence jsonb not null default '{}'::jsonb,
  primary key (account_id, child_key, achievement_key)
);

create table if not exists public.learning_certificates (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null,
  subject_id text not null check (subject_id in ('bahasa','english','math','iqro','color')),
  criteria_version text not null,
  issued_at timestamptz not null default now(),
  evidence_snapshot jsonb not null default '{}'::jsonb,
  unique (account_id, child_key, subject_id, criteria_version)
);

alter table public.learning_skills enable row level security;
alter table public.learning_activities enable row level security;
alter table public.learning_activity_skills enable row level security;
alter table public.learning_attempts enable row level security;
alter table public.learning_attempt_skill_evidence enable row level security;
alter table public.child_skill_mastery enable row level security;
alter table public.child_learning_progress enable row level security;
alter table public.child_learning_achievements enable row level security;
alter table public.learning_certificates enable row level security;

drop policy if exists "learning skills public read" on public.learning_skills;
create policy "learning skills public read" on public.learning_skills
  for select using (active = true or public.is_admin());
drop policy if exists "learning skills admin write" on public.learning_skills;
create policy "learning skills admin write" on public.learning_skills
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "learning activities public read" on public.learning_activities;
create policy "learning activities public read" on public.learning_activities
  for select using (active = true or public.is_admin());
drop policy if exists "learning activities admin write" on public.learning_activities;
create policy "learning activities admin write" on public.learning_activities
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "learning activity skills public read" on public.learning_activity_skills;
create policy "learning activity skills public read" on public.learning_activity_skills
  for select using (true);
drop policy if exists "learning activity skills admin write" on public.learning_activity_skills;
create policy "learning activity skills admin write" on public.learning_activity_skills
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "learning attempts own select" on public.learning_attempts;
create policy "learning attempts own select" on public.learning_attempts
  for select using (account_id = auth.uid());
drop policy if exists "learning evidence own select" on public.learning_attempt_skill_evidence;
create policy "learning evidence own select" on public.learning_attempt_skill_evidence
  for select using (account_id = auth.uid());

drop policy if exists "child mastery own select" on public.child_skill_mastery;
create policy "child mastery own select" on public.child_skill_mastery
  for select using (account_id = auth.uid());
drop policy if exists "child learning progress own select" on public.child_learning_progress;
create policy "child learning progress own select" on public.child_learning_progress
  for select using (account_id = auth.uid());
drop policy if exists "child achievements own select" on public.child_learning_achievements;
create policy "child achievements own select" on public.child_learning_achievements
  for select using (account_id = auth.uid());
drop policy if exists "learning certificates own select" on public.learning_certificates;
create policy "learning certificates own select" on public.learning_certificates
  for select using (account_id = auth.uid());

-- Evidence/mastery/progress/certificate mutations are server-owned. Clients submit
-- canonical attempts through record_learning_attempt instead of writing derived data.
revoke insert, update, delete on public.learning_attempts from anon, authenticated;
revoke insert, update, delete on public.learning_attempt_skill_evidence from anon, authenticated;
revoke insert, update, delete on public.child_skill_mastery from anon, authenticated;
revoke insert, update, delete on public.child_learning_progress from anon, authenticated;
revoke insert, update, delete on public.child_learning_achievements from anon, authenticated;
revoke insert, update, delete on public.learning_certificates from anon, authenticated;

insert into public.learning_skills(skill_key, subject_id, title, description, domain, age_min, age_max)
values
  ('bahasa.huruf.a.recognition','bahasa','Mengenali huruf A','Mengenali bentuk dan bunyi huruf A dari pilihan sederhana.','literacy',3,7),
  ('bahasa.huruf.awal.matching','bahasa','Memasangkan huruf awal','Memasangkan huruf dengan contoh kata yang memiliki huruf awal sesuai.','literacy',4,7),
  ('bahasa.cerita.listening','bahasa','Menyimak cerita','Berlatih menyimak cerita pendek bersama pendamping.','language',4,7),
  ('english.color.blue','english','English color word: blue','Mengenali kata warna blue melalui visual dan audio.','language',4,7),
  ('english.word.cat.listening','english','Listening word: cat','Menghubungkan kata cat yang didengar dengan visual yang sesuai.','language',3,7),
  ('english.word.picture_matching','english','Word-picture matching','Memasangkan kata English sederhana dengan gambar yang sesuai.','language',5,7),
  ('math.count.1_3','math','Menghitung 1–3','Menghitung kumpulan benda sampai tiga dan memilih jumlahnya.','numeracy',3,7),
  ('math.numeral.5.formation','math','Membentuk angka 5','Menelusuri bentuk angka 5 mengikuti jalur yang diberikan.','motor',3,7),
  ('math.pattern.matching','math','Mencocokkan pola','Mengenali dan memasangkan bentuk atau pola yang sama.','numeracy',5,7),
  ('iqro.alif.recognition','iqro','Mengenali Alif','Mengenali bentuk dan petunjuk audio huruf Alif.','religious_literacy',3,7),
  ('iqro.hijaiyah.motion_practice','iqro','Latihan Hijaiyah dengan gerak','Latihan opsional pengenalan Hijaiyah melalui permainan gerak.','religious_literacy',4,7),
  ('color.creative.choice','color','Eksplorasi pilihan warna','Mengeksplorasi pilihan dan kombinasi warna tanpa penilaian benar atau salah.','creative',3,7)
on conflict (skill_key) do update set
  subject_id = excluded.subject_id,
  title = excluded.title,
  description = excluded.description,
  domain = excluded.domain,
  age_min = excluded.age_min,
  age_max = excluded.age_max,
  active = true,
  updated_at = now();

insert into public.learning_activities(activity_id, subject_id, stage_id, runtime, difficulty, assessment, required_for_stage, motion_optional, star_reward)
values
  ('bahasa-cari-a','bahasa','bahasa-huruf','tap_choice',1,'assessed',true,false,2),
  ('bahasa-dengar-a','bahasa','bahasa-huruf','listen_and_choose',1,'assessed',true,false,2),
  ('bahasa-pasang-awal','bahasa','bahasa-huruf','matching',2,'assessed',true,false,3),
  ('bahasa-cerita-teman','bahasa','bahasa-cerita','story',1,'practice',true,false,2),
  ('english-find-blue','english','english-first-words','tap_choice',1,'assessed',true,false,2),
  ('english-listen-cat','english','english-first-words','listen_and_choose',1,'assessed',true,false,2),
  ('english-match-hello','english','english-first-words','matching',2,'assessed',true,false,3),
  ('math-count-3','math','math-angka','tap_choice',1,'assessed',true,false,2),
  ('math-trace-5-touch','math','math-angka','trace',1,'assessed',true,false,3),
  ('math-number-trace-motion','math','math-angka','motion_game',2,'practice',false,true,3),
  ('math-pattern-touch','math','math-pola','matching',2,'assessed',true,false,3),
  ('math-pattern-motion','math','math-pola','motion_game',3,'practice',false,true,3),
  ('iqro-cari-alif','iqro','iqro-huruf','tap_choice',1,'assessed',true,false,2),
  ('iqro-dengar-alif','iqro','iqro-huruf','listen_and_choose',1,'assessed',true,false,2),
  ('iqro-motion-existing','iqro','iqro-huruf','motion_game',2,'practice',false,true,3),
  ('color-gavi','color','color-characters','coloring',1,'practice',true,false,2),
  ('color-paca','color','color-characters','coloring',1,'practice',true,false,2)
on conflict (activity_id) do update set
  subject_id = excluded.subject_id,
  stage_id = excluded.stage_id,
  runtime = excluded.runtime,
  difficulty = excluded.difficulty,
  assessment = excluded.assessment,
  required_for_stage = excluded.required_for_stage,
  motion_optional = excluded.motion_optional,
  star_reward = excluded.star_reward,
  active = true,
  updated_at = now();

insert into public.learning_activity_skills(activity_id, skill_key, evidence_weight)
values
  ('bahasa-cari-a','bahasa.huruf.a.recognition',1),
  ('bahasa-dengar-a','bahasa.huruf.a.recognition',1),
  ('bahasa-pasang-awal','bahasa.huruf.awal.matching',1),
  ('bahasa-cerita-teman','bahasa.cerita.listening',0.35),
  ('english-find-blue','english.color.blue',1),
  ('english-listen-cat','english.word.cat.listening',1),
  ('english-match-hello','english.word.picture_matching',1),
  ('math-count-3','math.count.1_3',1),
  ('math-trace-5-touch','math.numeral.5.formation',1),
  ('math-number-trace-motion','math.numeral.5.formation',0.5),
  ('math-pattern-touch','math.pattern.matching',1),
  ('math-pattern-motion','math.pattern.matching',0.5),
  ('iqro-cari-alif','iqro.alif.recognition',1),
  ('iqro-dengar-alif','iqro.alif.recognition',1),
  ('iqro-motion-existing','iqro.hijaiyah.motion_practice',0.4),
  ('color-gavi','color.creative.choice',0.3),
  ('color-paca','color.creative.choice',0.3)
on conflict (activity_id, skill_key) do update set evidence_weight = excluded.evidence_weight;
