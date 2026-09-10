-- Mainlagi Expansion Batch 7 — Math Wave A (activities 8-25)
-- Adds 18 reviewed Math activities so the canonical Math catalog reaches 25.
-- Additive only: historical activity IDs, attempts, mastery, progress, awards,
-- certificates, and profile ownership remain unchanged.

insert into public.learning_skills(
  skill_key, subject_id, title, description, domain, age_min, age_max, active, updated_at
)
values
  ('math.numeral.recognition.0_10','math','Mengenali angka 0–10','Membedakan simbol angka dasar dari 0 sampai 10.','numeracy',3,7,true,now()),
  ('math.count.4_10','math','Menghitung 4–10','Menghitung kumpulan benda dari empat sampai sepuluh.','numeracy',3,7,true,now()),
  ('math.quantity.matching','math','Mencocokkan angka dan jumlah','Menghubungkan simbol angka dengan representasi jumlah yang setara.','numeracy',4,7,true,now()),
  ('math.quantity.subitizing','math','Mengenali jumlah sekilas','Mengenali jumlah kecil dari susunan visual dengan cepat.','numeracy',4,7,true,now())
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
  ('math.pack.numeral-0-10','math','math-fondasi-numerasi','math-jumlah-dasar','Kenal Angka 0–10','1.0.0',3,7,'internal',true,now()),
  ('math.pack.count-4-10','math','math-fondasi-numerasi','math-jumlah-dasar','Hitung 4–10','1.0.0',3,7,'internal',true,now()),
  ('math.pack.quantity-match','math','math-fondasi-numerasi','math-jumlah-dasar','Angka dan Jumlah','1.0.0',4,7,'internal',true,now()),
  ('math.pack.subitizing','math','math-fondasi-numerasi','math-jumlah-dasar','Jumlah Sekilas','1.0.0',4,7,'internal',true,now())
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
  ('math-recognize-0','math','math-jumlah-dasar','tap_choice',1,'assessed',true,false,2,'math.pack.numeral-0-10','math-numeral-0-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-recognize-1','math','math-jumlah-dasar','tap_choice',1,'assessed',false,false,2,'math.pack.numeral-0-10','math-numeral-0-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-recognize-4','math','math-jumlah-dasar','tap_choice',1,'assessed',false,false,2,'math.pack.numeral-0-10','math-numeral-0-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-recognize-7','math','math-jumlah-dasar','tap_choice',1,'assessed',true,false,2,'math.pack.numeral-0-10','math-numeral-0-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-4','math','math-jumlah-dasar','tap_choice',1,'assessed',true,false,2,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-5','math','math-jumlah-dasar','tap_choice',1,'assessed',false,false,2,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-6','math','math-jumlah-dasar','tap_choice',1,'assessed',false,false,2,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-7','math','math-jumlah-dasar','tap_choice',2,'assessed',false,false,3,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-8','math','math-jumlah-dasar','tap_choice',2,'assessed',true,false,3,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-9','math','math-jumlah-dasar','tap_choice',2,'assessed',false,false,3,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-count-10','math','math-jumlah-dasar','tap_choice',2,'assessed',true,false,3,'math.pack.count-4-10','math-count-4-10','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-match-number-quantity-1-2','math','math-jumlah-dasar','matching',2,'assessed',true,false,3,'math.pack.quantity-match','math-quantity-match','matching','matching_accuracy_v1',1,true,now()),
  ('math-match-number-quantity-3-4','math','math-jumlah-dasar','matching',2,'assessed',false,false,3,'math.pack.quantity-match','math-quantity-match','matching','matching_accuracy_v1',1,true,now()),
  ('math-match-number-quantity-5-6','math','math-jumlah-dasar','matching',2,'assessed',false,false,3,'math.pack.quantity-match','math-quantity-match','matching','matching_accuracy_v1',1,true,now()),
  ('math-match-number-quantity-7-8','math','math-jumlah-dasar','matching',2,'assessed',false,false,3,'math.pack.quantity-match','math-quantity-match','matching','matching_accuracy_v1',1,true,now()),
  ('math-subitize-2','math','math-jumlah-dasar','tap_choice',1,'assessed',false,false,2,'math.pack.subitizing','math-subitizing','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-subitize-4','math','math-jumlah-dasar','tap_choice',2,'assessed',true,false,3,'math.pack.subitizing','math-subitizing','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-subitize-5','math','math-jumlah-dasar','tap_choice',2,'assessed',false,false,3,'math.pack.subitizing','math-subitizing','tap_choice','choice_accuracy_v1',1,true,now())
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
  ('math-recognize-0','math.numeral.recognition.0_10',1),
  ('math-recognize-1','math.numeral.recognition.0_10',1),
  ('math-recognize-4','math.numeral.recognition.0_10',1),
  ('math-recognize-7','math.numeral.recognition.0_10',1),
  ('math-count-4','math.count.4_10',1),
  ('math-count-5','math.count.4_10',1),
  ('math-count-6','math.count.4_10',1),
  ('math-count-7','math.count.4_10',1),
  ('math-count-8','math.count.4_10',1),
  ('math-count-9','math.count.4_10',1),
  ('math-count-10','math.count.4_10',1),
  ('math-match-number-quantity-1-2','math.quantity.matching',1),
  ('math-match-number-quantity-3-4','math.quantity.matching',1),
  ('math-match-number-quantity-5-6','math.quantity.matching',1),
  ('math-match-number-quantity-7-8','math.quantity.matching',1),
  ('math-subitize-2','math.quantity.subitizing',1),
  ('math-subitize-4','math.quantity.subitizing',1),
  ('math-subitize-5','math.quantity.subitizing',1)
on conflict (activity_id, skill_key) do update set evidence_weight = excluded.evidence_weight;
