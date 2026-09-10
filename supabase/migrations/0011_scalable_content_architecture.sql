-- Mainlagi scalable content architecture (Batch 4)
-- Additive only: historical activity IDs remain the primary identity used by
-- attempts/mastery/progress. No legacy learning or game table is dropped.

create table if not exists public.learning_content_packs (
  pack_id text primary key,
  subject_id text not null check (subject_id in ('bahasa','english','math','iqro','color')),
  path_id text not null,
  stage_id text not null,
  title text not null,
  version text not null check (version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  age_min smallint not null check (age_min between 3 and 7),
  age_max smallint not null check (age_max between 3 and 7 and age_max >= age_min),
  review_status text not null check (review_status in ('internal','expert_required','expert_approved')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learning_content_packs enable row level security;

drop policy if exists "learning content packs public read" on public.learning_content_packs;
create policy "learning content packs public read" on public.learning_content_packs
  for select using (active = true or (select private.is_admin()));

drop policy if exists "learning content packs admin insert" on public.learning_content_packs;
create policy "learning content packs admin insert" on public.learning_content_packs
  for insert with check ((select private.is_admin()));
drop policy if exists "learning content packs admin update" on public.learning_content_packs;
create policy "learning content packs admin update" on public.learning_content_packs
  for update using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "learning content packs admin delete" on public.learning_content_packs;
create policy "learning content packs admin delete" on public.learning_content_packs
  for delete using ((select private.is_admin()));

grant select on public.learning_content_packs to anon;
grant select, insert, update, delete on public.learning_content_packs to authenticated, service_role;

create index if not exists idx_learning_content_packs_stage
  on public.learning_content_packs(subject_id, stage_id, active);
create index if not exists idx_learning_content_packs_path
  on public.learning_content_packs(path_id, active);

alter table public.learning_activities
  add column if not exists content_pack_id text references public.learning_content_packs(pack_id),
  add column if not exists lesson_id text,
  add column if not exists mechanic_id text check (mechanic_id is null or mechanic_id in ('tap_choice','listen_and_choose','matching','guided_trace','story','coloring','motion_game')),
  add column if not exists evidence_contract text check (evidence_contract is null or evidence_contract in ('choice_accuracy_v1','matching_accuracy_v1','guided_trace_path_v1','completion_only_v1')),
  add column if not exists content_revision smallint not null default 1 check (content_revision > 0);

create index if not exists idx_learning_activities_content_pack
  on public.learning_activities(content_pack_id, active);
create index if not exists idx_learning_activities_lesson
  on public.learning_activities(lesson_id, active);

insert into public.learning_content_packs(
  pack_id, subject_id, path_id, stage_id, title, version,
  age_min, age_max, review_status, active, updated_at
)
values
  ('bahasa.pack.huruf-a','bahasa','bahasa-fondasi-literasi','bahasa-huruf','Huruf A','1.0.0',3,7,'internal',true,now()),
  ('bahasa.pack.huruf-awal','bahasa','bahasa-fondasi-literasi','bahasa-huruf','Huruf Awal','1.0.0',4,7,'internal',true,now()),
  ('bahasa.pack.cerita-teman','bahasa','bahasa-fondasi-literasi','bahasa-cerita','Cerita Teman','1.0.0',4,7,'internal',true,now()),
  ('english.pack.blue','english','english-first-steps','english-first-words','Blue','1.0.0',4,7,'internal',true,now()),
  ('english.pack.cat','english','english-first-steps','english-first-words','Cat','1.0.0',3,7,'internal',true,now()),
  ('english.pack.word-picture','english','english-first-steps','english-first-words','Word & Picture','1.0.0',5,7,'internal',true,now()),
  ('math.pack.count-small','math','math-fondasi-numerasi','math-angka','Hitung Jumlah Kecil','1.0.0',3,7,'internal',true,now()),
  ('math.pack.number-five','math','math-fondasi-numerasi','math-angka','Angka 5','1.0.0',3,7,'internal',true,now()),
  ('math.pack.patterns','math','math-fondasi-numerasi','math-pola','Pola & Bentuk','1.0.0',5,7,'internal',true,now()),
  ('iqro.pack.alif','iqro','iqro-fondasi-hijaiyah','iqro-huruf','Alif','1.0.0',3,7,'expert_required',true,now()),
  ('iqro.pack.motion-practice','iqro','iqro-fondasi-hijaiyah','iqro-huruf','Hijaiyah Motion Practice','1.0.0',4,7,'expert_required',true,now()),
  ('color.pack.gavi','color','color-creative-play','color-characters','Gavi','1.0.0',3,7,'internal',true,now()),
  ('color.pack.paca','color','color-creative-play','color-characters','Paca','1.0.0',3,7,'internal',true,now())
on conflict (pack_id) do update set
  subject_id = excluded.subject_id,
  path_id = excluded.path_id,
  stage_id = excluded.stage_id,
  title = excluded.title,
  version = excluded.version,
  age_min = excluded.age_min,
  age_max = excluded.age_max,
  review_status = excluded.review_status,
  active = true,
  updated_at = now();

update public.learning_activities as la
set
  content_pack_id = meta.content_pack_id,
  lesson_id = meta.lesson_id,
  mechanic_id = meta.mechanic_id,
  evidence_contract = meta.evidence_contract,
  content_revision = meta.content_revision,
  updated_at = now()
from (values
  ('bahasa-cari-a','bahasa.pack.huruf-a','bahasa-huruf-a','tap_choice','choice_accuracy_v1',1),
  ('bahasa-dengar-a','bahasa.pack.huruf-a','bahasa-huruf-a','listen_and_choose','choice_accuracy_v1',1),
  ('bahasa-cari-a-lagi','bahasa.pack.huruf-a','bahasa-huruf-a','tap_choice','choice_accuracy_v1',1),
  ('bahasa-pasang-awal','bahasa.pack.huruf-awal','bahasa-huruf-awal','matching','matching_accuracy_v1',1),
  ('bahasa-pasang-awal-lagi','bahasa.pack.huruf-awal','bahasa-huruf-awal','matching','matching_accuracy_v1',1),
  ('bahasa-cerita-teman','bahasa.pack.cerita-teman','bahasa-cerita-teman','story','completion_only_v1',1),
  ('english-find-blue','english.pack.blue','english-color-blue','tap_choice','choice_accuracy_v1',1),
  ('english-find-blue-audio','english.pack.blue','english-color-blue','listen_and_choose','choice_accuracy_v1',1),
  ('english-listen-cat','english.pack.cat','english-listen-cat','listen_and_choose','choice_accuracy_v1',1),
  ('english-listen-cat-2','english.pack.cat','english-listen-cat','listen_and_choose','choice_accuracy_v1',1),
  ('english-match-hello','english.pack.word-picture','english-word-picture','matching','matching_accuracy_v1',1),
  ('english-match-words-2','english.pack.word-picture','english-word-picture','matching','matching_accuracy_v1',1),
  ('math-count-3','math.pack.count-small','math-count-small','tap_choice','choice_accuracy_v1',1),
  ('math-count-2','math.pack.count-small','math-count-small','tap_choice','choice_accuracy_v1',1),
  ('math-trace-5-touch','math.pack.number-five','math-form-five','guided_trace','guided_trace_path_v1',1),
  ('math-number-trace-motion','math.pack.number-five','math-form-five','motion_game','completion_only_v1',1),
  ('math-pattern-touch','math.pack.patterns','math-patterns','matching','matching_accuracy_v1',1),
  ('math-pattern-touch-2','math.pack.patterns','math-patterns','matching','matching_accuracy_v1',1),
  ('math-pattern-motion','math.pack.patterns','math-patterns','motion_game','completion_only_v1',1),
  ('iqro-cari-alif','iqro.pack.alif','iqro-alif','tap_choice','choice_accuracy_v1',1),
  ('iqro-dengar-alif','iqro.pack.alif','iqro-alif','listen_and_choose','choice_accuracy_v1',1),
  ('iqro-pasang-alif','iqro.pack.alif','iqro-alif','matching','matching_accuracy_v1',1),
  ('iqro-motion-existing','iqro.pack.motion-practice','iqro-motion-practice','motion_game','completion_only_v1',1),
  ('color-gavi','color.pack.gavi','color-gavi','coloring','completion_only_v1',1),
  ('color-paca','color.pack.paca','color-paca','coloring','completion_only_v1',1)
) as meta(activity_id, content_pack_id, lesson_id, mechanic_id, evidence_contract, content_revision)
where la.activity_id = meta.activity_id;

comment on table public.learning_content_packs is
  'Versioned curriculum content-pack metadata. Historical learning identity remains learning_activities.activity_id.';
comment on column public.learning_activities.content_pack_id is
  'Optional pack ownership for scalable content. Null remains valid for external/legacy rows not yet registered in the repository manifest.';
comment on column public.learning_activities.content_revision is
  'Monotonic authoring revision for the stable activity_id; increment when scored content semantics change.';
