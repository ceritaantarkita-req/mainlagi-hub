-- Mainlagi curriculum content expansion
-- Adds varied assessed evidence activities for existing foundational skills.
-- These variants are intentionally NOT required_for_stage: they enrich mastery
-- evidence without turning content breadth into a new completion blocker.

insert into public.learning_activities(
  activity_id,
  subject_id,
  stage_id,
  runtime,
  difficulty,
  assessment,
  required_for_stage,
  motion_optional,
  star_reward,
  active,
  updated_at
)
values
  ('bahasa-cari-a-lagi','bahasa','bahasa-huruf','tap_choice',1,'assessed',false,false,2,true,now()),
  ('bahasa-pasang-awal-lagi','bahasa','bahasa-huruf','matching',2,'assessed',false,false,3,true,now()),
  ('english-find-blue-audio','english','english-first-words','listen_and_choose',1,'assessed',false,false,2,true,now()),
  ('english-listen-cat-2','english','english-first-words','listen_and_choose',1,'assessed',false,false,2,true,now()),
  ('english-match-words-2','english','english-first-words','matching',2,'assessed',false,false,3,true,now()),
  ('math-count-2','math','math-angka','tap_choice',1,'assessed',false,false,2,true,now()),
  ('math-pattern-touch-2','math','math-pola','matching',2,'assessed',false,false,3,true,now()),
  ('iqro-pasang-alif','iqro','iqro-huruf','matching',2,'assessed',false,false,3,true,now())
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
  ('bahasa-cari-a-lagi','bahasa.huruf.a.recognition',1),
  ('bahasa-pasang-awal-lagi','bahasa.huruf.awal.matching',1),
  ('english-find-blue-audio','english.color.blue',1),
  ('english-listen-cat-2','english.word.cat.listening',1),
  ('english-match-words-2','english.word.picture_matching',1),
  ('math-count-2','math.count.1_3',1),
  ('math-pattern-touch-2','math.pattern.matching',1),
  ('iqro-pasang-alif','iqro.alif.recognition',1)
on conflict (activity_id, skill_key) do update set
  evidence_weight = excluded.evidence_weight;
