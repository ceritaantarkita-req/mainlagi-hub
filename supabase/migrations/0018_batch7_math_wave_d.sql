-- Mainlagi Expansion Batch 7 — Math Wave D (activities 76-100)
-- Adds the final 25 reviewed Math activities so canonical Math reaches 100.
-- Additive only: historical activity IDs and learning history remain unchanged.

insert into public.learning_skills(skill_key, subject_id, title, description, domain, age_min, age_max, active, updated_at)
values
  ('math.spatial.position','math','Memahami posisi ruang','Mengenali kiri-kanan, atas-bawah, dalam-luar, dekat-jauh, dan posisi di antara.','numeracy',4,7,true,now()),
  ('math.measure.intuition','math','Intuisi pengukuran','Membandingkan panjang, kapasitas, dan ukuran dari representasi sederhana.','numeracy',5,7,true,now()),
  ('math.operation.mixed','math','Operasi campuran sederhana','Menentukan dan menyelesaikan penjumlahan atau pengurangan sederhana sampai 10.','numeracy',5,7,true,now()),
  ('math.problem.visual','math','Masalah matematika visual','Menalar cerita pendek dengan jumlah kecil dan memilih hasil yang tepat.','numeracy',5,7,true,now()),
  ('math.review.integration','math','Integrasi konsep numerasi','Menggunakan beberapa konsep dasar matematika dalam review yang bervariasi.','numeracy',5,7,true,now())
on conflict (skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id, subject_id, path_id, stage_id, title, version, age_min, age_max, review_status, active, updated_at)
values
  ('math.pack.spatial-position','math','math-fondasi-numerasi','math-ukur-ruang','Posisi dan Ruang','1.0.0',4,7,'internal',true,now()),
  ('math.pack.measure-intuition','math','math-fondasi-numerasi','math-ukur-ruang','Intuisi Pengukuran','1.0.0',5,7,'internal',true,now()),
  ('math.pack.mixed-operations','math','math-fondasi-numerasi','math-ukur-ruang','Operasi Campuran','1.0.0',5,7,'internal',true,now()),
  ('math.pack.visual-problems','math','math-fondasi-numerasi','math-ukur-ruang','Masalah Visual','1.0.0',5,7,'internal',true,now()),
  ('math.pack.review-challenge','math','math-fondasi-numerasi','math-ukur-ruang','Review Matematika','1.0.0',5,7,'internal',true,now())
on conflict (pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id, subject_id, stage_id, runtime, difficulty, assessment, required_for_stage, motion_optional, star_reward, content_pack_id, lesson_id, mechanic_id, evidence_contract, content_revision, active, updated_at)
values
  ('math-spatial-above','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.spatial-position','math-spatial-position','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-spatial-left','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.spatial-position','math-spatial-position','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-spatial-inside','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.spatial-position','math-spatial-position','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-spatial-near','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.spatial-position','math-spatial-position','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-spatial-between','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.spatial-position','math-spatial-position','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-measure-longer','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.measure-intuition','math-measure-intuition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-measure-more-capacity','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.measure-intuition','math-measure-intuition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-measure-fuller','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.measure-intuition','math-measure-intuition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-measure-match-length','math','math-ukur-ruang','matching',3,'assessed',true,false,3,'math.pack.measure-intuition','math-measure-intuition','matching','matching_accuracy_v1',1,true,now()),
  ('math-measure-three-lengths','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.measure-intuition','math-measure-intuition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-mixed-add-2-3','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.mixed-operations','math-mixed-operations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-mixed-sub-6-1','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.mixed-operations','math-mixed-operations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-mixed-choose-add','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.mixed-operations','math-mixed-operations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-mixed-add-4-4','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.mixed-operations','math-mixed-operations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-mixed-sub-9-3','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.mixed-operations','math-mixed-operations','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-problem-apples','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.visual-problems','math-visual-problems','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-problem-birds','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.visual-problems','math-visual-problems','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-problem-cars','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.visual-problems','math-visual-problems','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-problem-cookies','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.visual-problems','math-visual-problems','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-problem-balloons','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.visual-problems','math-visual-problems','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-review-numeral-10','math','math-ukur-ruang','tap_choice',3,'assessed',true,false,3,'math.pack.review-challenge','math-review-challenge','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-review-quantity-7','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.review-challenge','math-review-challenge','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-review-shape-property','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.review-challenge','math-review-challenge','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-review-pattern','math','math-ukur-ruang','tap_choice',3,'assessed',false,false,3,'math.pack.review-challenge','math-review-challenge','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-review-match-concepts','math','math-ukur-ruang','matching',3,'assessed',true,false,3,'math.pack.review-challenge','math-review-challenge','matching','matching_accuracy_v1',1,true,now())
on conflict (activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id, skill_key, evidence_weight)
values
  ('math-spatial-above','math.spatial.position',1),('math-spatial-left','math.spatial.position',1),('math-spatial-inside','math.spatial.position',1),('math-spatial-near','math.spatial.position',1),('math-spatial-between','math.spatial.position',1),
  ('math-measure-longer','math.measure.intuition',1),('math-measure-more-capacity','math.measure.intuition',1),('math-measure-fuller','math.measure.intuition',1),('math-measure-match-length','math.measure.intuition',1),('math-measure-three-lengths','math.measure.intuition',1),
  ('math-mixed-add-2-3','math.operation.mixed',1),('math-mixed-sub-6-1','math.operation.mixed',1),('math-mixed-choose-add','math.operation.mixed',1),('math-mixed-add-4-4','math.operation.mixed',1),('math-mixed-sub-9-3','math.operation.mixed',1),
  ('math-problem-apples','math.problem.visual',1),('math-problem-birds','math.problem.visual',1),('math-problem-cars','math.problem.visual',1),('math-problem-cookies','math.problem.visual',1),('math-problem-balloons','math.problem.visual',1),
  ('math-review-numeral-10','math.review.integration',1),('math-review-quantity-7','math.review.integration',1),('math-review-shape-property','math.review.integration',1),('math-review-pattern','math.review.integration',1),('math-review-match-concepts','math.review.integration',1)
on conflict (activity_id, skill_key) do update set evidence_weight=excluded.evidence_weight;
