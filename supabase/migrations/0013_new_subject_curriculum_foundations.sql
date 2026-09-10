-- Mainlagi new subject/curriculum foundations (Batch 6)
-- Additive migration: widen the canonical subject vocabulary and register
-- starter curriculum data for Letters/Menulis, Logic, and Science.
-- Historical activity IDs, attempts, mastery, progress, and certificates are
-- preserved unchanged.

alter table public.learning_skills
  drop constraint if exists learning_skills_subject_id_check;
alter table public.learning_skills
  add constraint learning_skills_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color'));

alter table public.learning_activities
  drop constraint if exists learning_activities_subject_id_check;
alter table public.learning_activities
  add constraint learning_activities_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color'));

alter table public.learning_attempts
  drop constraint if exists learning_attempts_subject_id_check;
alter table public.learning_attempts
  add constraint learning_attempts_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color'));

alter table public.learning_certificates
  drop constraint if exists learning_certificates_subject_id_check;
alter table public.learning_certificates
  add constraint learning_certificates_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color'));

alter table public.learning_content_packs
  drop constraint if exists learning_content_packs_subject_id_check;
alter table public.learning_content_packs
  add constraint learning_content_packs_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color'));

insert into public.learning_skills(
  skill_key, subject_id, title, description, domain, age_min, age_max, active, updated_at
)
values
  ('letters.latin.a.recognition','letters','Mengenali bentuk huruf A','Mengenali huruf A dan membedakannya dari bentuk huruf lain.','literacy',3,7,true,now()),
  ('letters.latin.a.formation','letters','Membentuk huruf A','Mengikuti jalur bentuk huruf A dengan gerakan jari yang terarah.','motor',3,7,true,now()),
  ('logic.visual.matching','logic','Mencocokkan objek visual','Mengenali dan memasangkan objek yang sama secara visual.','reasoning',3,7,true,now()),
  ('logic.visual.discrimination','logic','Membedakan dan membandingkan','Menemukan objek berbeda dan membandingkan kelompok kecil melalui petunjuk visual.','reasoning',3,7,true,now()),
  ('science.living.classification','science','Mengenali makhluk hidup dan tumbuhan','Membedakan contoh sederhana makhluk hidup atau tumbuhan dari benda lain.','science',3,7,true,now()),
  ('science.animals.habitat','science','Hewan dan tempat hidup','Menghubungkan hewan dengan tempat hidup yang sesuai pada contoh sederhana.','science',4,7,true,now())
on conflict (skill_key) do update set
  subject_id = excluded.subject_id,
  title = excluded.title,
  description = excluded.description,
  domain = excluded.domain,
  age_min = excluded.age_min,
  age_max = excluded.age_max,
  active = true,
  updated_at = now();

insert into public.learning_content_packs(
  pack_id, subject_id, path_id, stage_id, title, version,
  age_min, age_max, review_status, active, updated_at
)
values
  ('letters.pack.letter-a','letters','letters-writing-foundations','letters-foundations','Huruf A & Menulis','1.0.0',3,7,'internal',true,now()),
  ('logic.pack.visual-basics','logic','logic-thinking-foundations','logic-foundations','Visual Logic Basics','1.0.0',3,7,'internal',true,now()),
  ('science.pack.living-world','science','science-discovery-foundations','science-foundations','Living World Basics','1.0.0',3,7,'internal',true,now())
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

insert into public.learning_activities(
  activity_id, subject_id, stage_id, runtime, difficulty, assessment,
  required_for_stage, motion_optional, star_reward, content_pack_id,
  lesson_id, mechanic_id, evidence_contract, content_revision, active, updated_at
)
values
  ('letters-find-a','letters','letters-foundations','tap_choice',1,'assessed',true,false,2,'letters.pack.letter-a','letters-a-foundations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('letters-trace-a','letters','letters-foundations','trace',1,'practice',true,false,3,'letters.pack.letter-a','letters-a-foundations','guided_trace','completion_only_v1',1,true,now()),
  ('letters-match-case','letters','letters-foundations','matching',2,'assessed',false,false,3,'letters.pack.letter-a','letters-a-foundations','matching','matching_accuracy_v1',1,true,now()),
  ('logic-match-pairs','logic','logic-foundations','matching',1,'assessed',true,false,2,'logic.pack.visual-basics','logic-visual-foundations','matching','matching_accuracy_v1',1,true,now()),
  ('logic-odd-one-out','logic','logic-foundations','tap_choice',1,'assessed',true,false,2,'logic.pack.visual-basics','logic-visual-foundations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('logic-more-less','logic','logic-foundations','tap_choice',2,'assessed',false,false,2,'logic.pack.visual-basics','logic-visual-foundations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('science-living-cat','science','science-foundations','tap_choice',1,'assessed',true,false,2,'science.pack.living-world','science-living-world','tap_choice','choice_accuracy_v1',1,true,now()),
  ('science-match-habitat','science','science-foundations','matching',2,'assessed',true,false,3,'science.pack.living-world','science-living-world','matching','matching_accuracy_v1',1,true,now()),
  ('science-find-plant','science','science-foundations','tap_choice',1,'assessed',false,false,2,'science.pack.living-world','science-living-world','tap_choice','choice_accuracy_v1',1,true,now())
on conflict (activity_id) do update set
  subject_id = excluded.subject_id,
  stage_id = excluded.stage_id,
  runtime = excluded.runtime,
  difficulty = excluded.difficulty,
  assessment = excluded.assessment,
  required_for_stage = excluded.required_for_stage,
  motion_optional = excluded.motion_optional,
  star_reward = excluded.star_reward,
  content_pack_id = excluded.content_pack_id,
  lesson_id = excluded.lesson_id,
  mechanic_id = excluded.mechanic_id,
  evidence_contract = excluded.evidence_contract,
  content_revision = excluded.content_revision,
  active = true,
  updated_at = now();

insert into public.learning_activity_skills(activity_id, skill_key, evidence_weight)
values
  ('letters-find-a','letters.latin.a.recognition',1),
  ('letters-trace-a','letters.latin.a.formation',0.5),
  ('letters-match-case','letters.latin.a.recognition',1),
  ('logic-match-pairs','logic.visual.matching',1),
  ('logic-odd-one-out','logic.visual.discrimination',1),
  ('logic-more-less','logic.visual.discrimination',1),
  ('science-living-cat','science.living.classification',1),
  ('science-match-habitat','science.animals.habitat',1),
  ('science-find-plant','science.living.classification',1)
on conflict (activity_id, skill_key) do update set
  evidence_weight = excluded.evidence_weight;

comment on constraint learning_skills_subject_id_check on public.learning_skills is
  'Canonical Mainlagi subject vocabulary after Batch 6. Drawing is intentionally deferred to its planned creative-track batch.';
comment on constraint learning_activities_subject_id_check on public.learning_activities is
  'Canonical Mainlagi subject vocabulary after Batch 6. Historical subject IDs remain valid.';
comment on constraint learning_attempts_subject_id_check on public.learning_attempts is
  'Attempts accept the same first-class subject vocabulary as the server-owned activity catalog.';
comment on constraint learning_certificates_subject_id_check on public.learning_certificates is
  'Certificate storage accepts all Batch 6 first-class academic subjects plus Coloring; eligibility remains evidence-driven.';
comment on constraint learning_content_packs_subject_id_check on public.learning_content_packs is
  'Versioned content packs accept all Batch 6 first-class subjects plus Coloring.';
