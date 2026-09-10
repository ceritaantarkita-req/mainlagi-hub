-- Mainlagi Expansion Batch 7 — Math Wave B (activities 26-50)
-- Adds 25 reviewed Math activities so the canonical Math catalog reaches 50.
-- Additive only; historical learning data and IDs are preserved.

insert into public.learning_skills(skill_key, subject_id, title, description, domain, age_min, age_max, active, updated_at)
values
  ('math.quantity.comparison','math','Membandingkan jumlah','Menentukan kelompok yang lebih banyak, lebih sedikit, atau sama.','numeracy',4,7,true,now()),
  ('math.number.ordering','math','Mengurutkan angka','Mengenali urutan angka naik dan turun sampai 10.','numeracy',4,7,true,now()),
  ('math.shape.recognition','math','Mengenali bentuk dasar','Membedakan lingkaran, segitiga, persegi, persegi panjang, dan bentuk dasar lain.','numeracy',3,7,true,now()),
  ('math.shape.properties','math','Sifat bentuk sederhana','Mengamati sisi dan sudut pada bentuk dasar secara visual.','numeracy',5,7,true,now()),
  ('math.pattern.sequence','math','Melanjutkan pola','Menentukan elemen berikutnya pada pola warna, bentuk, atau jumlah sederhana.','numeracy',4,7,true,now())
on conflict (skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id, subject_id, path_id, stage_id, title, version, age_min, age_max, review_status, active, updated_at)
values
  ('math.pack.compare-quantities','math','math-fondasi-numerasi','math-banding-bentuk','Bandingkan Jumlah','1.0.0',4,7,'internal',true,now()),
  ('math.pack.order-numbers','math','math-fondasi-numerasi','math-banding-bentuk','Urutan Angka','1.0.0',4,7,'internal',true,now()),
  ('math.pack.shapes','math','math-fondasi-numerasi','math-banding-bentuk','Bentuk Dasar','1.0.0',3,7,'internal',true,now()),
  ('math.pack.pattern-sequences','math','math-fondasi-numerasi','math-banding-bentuk','Pola Berulang','1.0.0',4,7,'internal',true,now())
on conflict (pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id, subject_id, stage_id, runtime, difficulty, assessment, required_for_stage, motion_optional, star_reward, content_pack_id, lesson_id, mechanic_id, evidence_contract, content_revision, active, updated_at)
values
  ('math-compare-more-2-4','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.compare-quantities','math-compare-quantities','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-compare-less-5-3','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.compare-quantities','math-compare-quantities','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-compare-equal-4-4','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.compare-quantities','math-compare-quantities','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-compare-more-6-5','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.compare-quantities','math-compare-quantities','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-compare-less-7-9','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.compare-quantities','math-compare-quantities','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-compare-more-10-8','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.compare-quantities','math-compare-quantities','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-order-next-1-2','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.order-numbers','math-order-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-order-next-3-4','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.order-numbers','math-order-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-order-before-6','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.order-numbers','math-order-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-order-between-6-8','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.order-numbers','math-order-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-order-descend-5','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.order-numbers','math-order-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-order-descend-10','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.order-numbers','math-order-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-shape-find-circle','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.shapes','math-shapes','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-shape-find-triangle','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.shapes','math-shapes','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-shape-find-square','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.shapes','math-shapes','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-shape-match-circle-square','math','math-banding-bentuk','matching',2,'assessed',false,false,3,'math.pack.shapes','math-shapes','matching','matching_accuracy_v1',1,true,now()),
  ('math-shape-match-triangle-rectangle','math','math-banding-bentuk','matching',2,'assessed',false,false,3,'math.pack.shapes','math-shapes','matching','matching_accuracy_v1',1,true,now()),
  ('math-shape-three-sides','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.shapes','math-shapes','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-pattern-ab-shapes','math','math-banding-bentuk','tap_choice',2,'assessed',true,false,3,'math.pack.pattern-sequences','math-pattern-sequences','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-pattern-aab-colors','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.pattern-sequences','math-pattern-sequences','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-pattern-number-step-one','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.pattern-sequences','math-pattern-sequences','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-pattern-number-step-two','math','math-banding-bentuk','tap_choice',3,'assessed',false,false,3,'math.pack.pattern-sequences','math-pattern-sequences','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-pattern-size','math','math-banding-bentuk','tap_choice',2,'assessed',false,false,3,'math.pack.pattern-sequences','math-pattern-sequences','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-pattern-match-ab','math','math-banding-bentuk','matching',2,'assessed',false,false,3,'math.pack.pattern-sequences','math-pattern-sequences','matching','matching_accuracy_v1',1,true,now()),
  ('math-pattern-match-aab','math','math-banding-bentuk','matching',3,'assessed',false,false,3,'math.pack.pattern-sequences','math-pattern-sequences','matching','matching_accuracy_v1',1,true,now())
on conflict (activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id, skill_key, evidence_weight)
values
  ('math-compare-more-2-4','math.quantity.comparison',1),
  ('math-compare-less-5-3','math.quantity.comparison',1),
  ('math-compare-equal-4-4','math.quantity.comparison',1),
  ('math-compare-more-6-5','math.quantity.comparison',1),
  ('math-compare-less-7-9','math.quantity.comparison',1),
  ('math-compare-more-10-8','math.quantity.comparison',1),
  ('math-order-next-1-2','math.number.ordering',1),
  ('math-order-next-3-4','math.number.ordering',1),
  ('math-order-before-6','math.number.ordering',1),
  ('math-order-between-6-8','math.number.ordering',1),
  ('math-order-descend-5','math.number.ordering',1),
  ('math-order-descend-10','math.number.ordering',1),
  ('math-shape-find-circle','math.shape.recognition',1),
  ('math-shape-find-triangle','math.shape.recognition',1),
  ('math-shape-find-square','math.shape.recognition',1),
  ('math-shape-match-circle-square','math.shape.recognition',1),
  ('math-shape-match-triangle-rectangle','math.shape.recognition',1),
  ('math-shape-three-sides','math.shape.properties',1),
  ('math-pattern-ab-shapes','math.pattern.sequence',1),
  ('math-pattern-aab-colors','math.pattern.sequence',1),
  ('math-pattern-number-step-one','math.pattern.sequence',1),
  ('math-pattern-number-step-two','math.pattern.sequence',1),
  ('math-pattern-size','math.pattern.sequence',1),
  ('math-pattern-match-ab','math.pattern.sequence',1),
  ('math-pattern-match-aab','math.pattern.sequence',1)
on conflict (activity_id, skill_key) do update set evidence_weight=excluded.evidence_weight;
