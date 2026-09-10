-- Mainlagi Expansion Batch 7 — Math Wave C (activities 51-75)
-- Adds 25 reviewed Math activities; additive only and preserves historical learning data/IDs.

insert into public.learning_skills(skill_key, subject_id, title, description, domain, age_min, age_max, active, updated_at)
values
  ('math.sequence.missing_number','math','Menemukan angka yang hilang','Menentukan angka yang hilang pada urutan sederhana naik atau turun.','numeracy',4,7,true,now()),
  ('math.grouping.equal_groups','math','Mengenali kelompok setara','Membagi atau membaca kumpulan sebagai kelompok kecil yang setara.','numeracy',4,7,true,now()),
  ('math.operation.addition.within_10','math','Penjumlahan sampai 10','Menggabungkan dua kelompok kecil dengan hasil tidak lebih dari sepuluh.','numeracy',5,7,true,now()),
  ('math.operation.subtraction.within_10','math','Pengurangan sampai 10','Mengurangi kelompok kecil dengan bilangan sampai sepuluh.','numeracy',5,7,true,now()),
  ('math.measure.size_length','math','Membandingkan panjang dan ukuran','Menggunakan kata lebih panjang, lebih pendek, lebih besar, dan lebih kecil dari visual sederhana.','numeracy',4,7,true,now())
on conflict (skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id, subject_id, path_id, stage_id, title, version, age_min, age_max, review_status, active, updated_at)
values
  ('math.pack.missing-numbers','math','math-fondasi-numerasi','math-operasi-awal','Angka yang Hilang','1.0.0',4,7,'internal',true,now()),
  ('math.pack.grouping','math','math-fondasi-numerasi','math-operasi-awal','Kelompok Kecil','1.0.0',4,7,'internal',true,now()),
  ('math.pack.addition','math','math-fondasi-numerasi','math-operasi-awal','Tambah Sederhana','1.0.0',5,7,'internal',true,now()),
  ('math.pack.subtraction','math','math-fondasi-numerasi','math-operasi-awal','Kurang Sederhana','1.0.0',5,7,'internal',true,now()),
  ('math.pack.size-length','math','math-fondasi-numerasi','math-operasi-awal','Panjang dan Ukuran','1.0.0',4,7,'internal',true,now())
on conflict (pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id, subject_id, stage_id, runtime, difficulty, assessment, required_for_stage, motion_optional, star_reward, content_pack_id, lesson_id, mechanic_id, evidence_contract, content_revision, active, updated_at)
values
  ('math-missing-1-3','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.missing-numbers','math-missing-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-missing-3-5','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.missing-numbers','math-missing-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-missing-before-6','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.missing-numbers','math-missing-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-missing-after-8','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.missing-numbers','math-missing-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-missing-descend-10-8','math','math-operasi-awal','tap_choice',3,'assessed',false,false,3,'math.pack.missing-numbers','math-missing-numbers','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-group-6-by-2','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.grouping','math-grouping','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-group-8-by-2','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.grouping','math-grouping','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-group-9-by-3','math','math-operasi-awal','tap_choice',3,'assessed',false,false,3,'math.pack.grouping','math-grouping','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-group-match-2s','math','math-operasi-awal','matching',2,'assessed',false,false,3,'math.pack.grouping','math-grouping','matching','matching_accuracy_v1',1,true,now()),
  ('math-group-match-3s','math','math-operasi-awal','matching',3,'assessed',true,false,3,'math.pack.grouping','math-grouping','matching','matching_accuracy_v1',1,true,now()),
  ('math-add-1-1','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.addition','math-addition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-add-2-1','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.addition','math-addition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-add-2-2','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.addition','math-addition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-add-3-2','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.addition','math-addition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-add-4-3','math','math-operasi-awal','tap_choice',3,'assessed',false,false,3,'math.pack.addition','math-addition','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-sub-3-1','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.subtraction','math-subtraction','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-sub-4-2','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.subtraction','math-subtraction','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-sub-5-1','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.subtraction','math-subtraction','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-sub-6-2','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.subtraction','math-subtraction','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-sub-7-3','math','math-operasi-awal','tap_choice',3,'assessed',false,false,3,'math.pack.subtraction','math-subtraction','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-length-longer-lines','math','math-operasi-awal','tap_choice',2,'assessed',true,false,3,'math.pack.size-length','math-size-length','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-length-shorter-lines','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.size-length','math-size-length','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-size-bigger-circles','math','math-operasi-awal','tap_choice',2,'assessed',false,false,3,'math.pack.size-length','math-size-length','tap_choice','choice_accuracy_v1',1,true,now()),
  ('math-size-match-words','math','math-operasi-awal','matching',2,'assessed',true,false,3,'math.pack.size-length','math-size-length','matching','matching_accuracy_v1',1,true,now()),
  ('math-length-order-three','math','math-operasi-awal','tap_choice',3,'assessed',false,false,3,'math.pack.size-length','math-size-length','tap_choice','choice_accuracy_v1',1,true,now())
on conflict (activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id, skill_key, evidence_weight)
values
  ('math-missing-1-3','math.sequence.missing_number',1),('math-missing-3-5','math.sequence.missing_number',1),('math-missing-before-6','math.sequence.missing_number',1),('math-missing-after-8','math.sequence.missing_number',1),('math-missing-descend-10-8','math.sequence.missing_number',1),('math-group-6-by-2','math.grouping.equal_groups',1),('math-group-8-by-2','math.grouping.equal_groups',1),('math-group-9-by-3','math.grouping.equal_groups',1),('math-group-match-2s','math.grouping.equal_groups',1),('math-group-match-3s','math.grouping.equal_groups',1),('math-add-1-1','math.operation.addition.within_10',1),('math-add-2-1','math.operation.addition.within_10',1),('math-add-2-2','math.operation.addition.within_10',1),('math-add-3-2','math.operation.addition.within_10',1),('math-add-4-3','math.operation.addition.within_10',1),('math-sub-3-1','math.operation.subtraction.within_10',1),('math-sub-4-2','math.operation.subtraction.within_10',1),('math-sub-5-1','math.operation.subtraction.within_10',1),('math-sub-6-2','math.operation.subtraction.within_10',1),('math-sub-7-3','math.operation.subtraction.within_10',1),('math-length-longer-lines','math.measure.size_length',1),('math-length-shorter-lines','math.measure.size_length',1),('math-size-bigger-circles','math.measure.size_length',1),('math-size-match-words','math.measure.size_length',1),('math-length-order-three','math.measure.size_length',1)
on conflict (activity_id, skill_key) do update set evidence_weight=excluded.evidence_weight;
