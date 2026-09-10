-- Mainlagi Expansion Batch 8 — Bahasa Indonesia Wave A (subject total 1-25)
-- Adds 19 reviewed Bahasa activities to the existing 6 so canonical Bahasa reaches 25.
-- Additive only: historical activity IDs and learning history remain unchanged.

insert into public.learning_skills(skill_key, subject_id, title, description, domain, age_min, age_max, active, updated_at)
values
  ('bahasa.vokal.recognition','bahasa','Mengenali huruf vokal','Mengenali A, I, U, E, dan O melalui bentuk visual yang berbeda.','literacy',3,7,true,now()),
  ('bahasa.vokal.listening','bahasa','Menyimak huruf vokal','Menghubungkan petunjuk audio dengan simbol huruf vokal yang tepat.','literacy',3,7,true,now()),
  ('bahasa.huruf.classification','bahasa','Membedakan vokal dan konsonan','Membedakan huruf vokal dari konsonan pada contoh sederhana.','literacy',4,7,true,now()),
  ('bahasa.huruf.case_matching','bahasa','Memasangkan huruf besar-kecil','Menghubungkan huruf kapital dengan bentuk huruf kecil yang sama.','literacy',4,7,true,now()),
  ('bahasa.bunyi.awal.recognition','bahasa','Mengenali bunyi awal kata','Menentukan huruf awal pada kata benda sehari-hari yang familiar.','language',4,7,true,now())
on conflict (skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id, subject_id, path_id, stage_id, title, version, age_min, age_max, review_status, active, updated_at)
values
  ('bahasa.pack.vokal-visual','bahasa','bahasa-fondasi-literasi','bahasa-dasar-huruf','Kenal Vokal','1.0.0',3,7,'internal',true,now()),
  ('bahasa.pack.vokal-audio','bahasa','bahasa-fondasi-literasi','bahasa-dasar-huruf','Dengar Vokal','1.0.0',3,7,'internal',true,now()),
  ('bahasa.pack.klasifikasi-huruf','bahasa','bahasa-fondasi-literasi','bahasa-dasar-huruf','Vokal & Konsonan','1.0.0',4,7,'internal',true,now()),
  ('bahasa.pack.huruf-besar-kecil','bahasa','bahasa-fondasi-literasi','bahasa-dasar-huruf','Huruf Besar-Kecil','1.0.0',4,7,'internal',true,now()),
  ('bahasa.pack.bunyi-awal','bahasa','bahasa-fondasi-literasi','bahasa-dasar-huruf','Bunyi Awal','1.0.0',4,7,'internal',true,now())
on conflict (pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id, subject_id, stage_id, runtime, difficulty, assessment, required_for_stage, motion_optional, star_reward, content_pack_id, lesson_id, mechanic_id, evidence_contract, content_revision, active, updated_at)
values
  ('bahasa-vokal-i','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',true,false,2,'bahasa.pack.vokal-visual','bahasa-vokal-visual','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-vokal-u','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',false,false,2,'bahasa.pack.vokal-visual','bahasa-vokal-visual','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-vokal-e','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',false,false,2,'bahasa.pack.vokal-visual','bahasa-vokal-visual','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-vokal-o','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',true,false,2,'bahasa.pack.vokal-visual','bahasa-vokal-visual','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-dengar-i','bahasa','bahasa-dasar-huruf','listen_and_choose',1,'assessed',true,false,2,'bahasa.pack.vokal-audio','bahasa-vokal-audio','listen_and_choose','choice_accuracy_v1',1,true,now()),
  ('bahasa-dengar-u','bahasa','bahasa-dasar-huruf','listen_and_choose',1,'assessed',false,false,2,'bahasa.pack.vokal-audio','bahasa-vokal-audio','listen_and_choose','choice_accuracy_v1',1,true,now()),
  ('bahasa-dengar-e','bahasa','bahasa-dasar-huruf','listen_and_choose',1,'assessed',false,false,2,'bahasa.pack.vokal-audio','bahasa-vokal-audio','listen_and_choose','choice_accuracy_v1',1,true,now()),
  ('bahasa-dengar-o','bahasa','bahasa-dasar-huruf','listen_and_choose',1,'assessed',true,false,2,'bahasa.pack.vokal-audio','bahasa-vokal-audio','listen_and_choose','choice_accuracy_v1',1,true,now()),
  ('bahasa-pilih-vokal-ae','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',true,false,2,'bahasa.pack.klasifikasi-huruf','bahasa-klasifikasi-huruf','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-pilih-vokal-io','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',false,false,2,'bahasa.pack.klasifikasi-huruf','bahasa-klasifikasi-huruf','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-pilih-konsonan-bd','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',false,false,2,'bahasa.pack.klasifikasi-huruf','bahasa-klasifikasi-huruf','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-pilih-konsonan-ks','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',true,false,2,'bahasa.pack.klasifikasi-huruf','bahasa-klasifikasi-huruf','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-match-case-ai','bahasa','bahasa-dasar-huruf','matching',2,'assessed',true,false,3,'bahasa.pack.huruf-besar-kecil','bahasa-huruf-besar-kecil','matching','matching_accuracy_v1',1,true,now()),
  ('bahasa-match-case-uo','bahasa','bahasa-dasar-huruf','matching',2,'assessed',false,false,3,'bahasa.pack.huruf-besar-kecil','bahasa-huruf-besar-kecil','matching','matching_accuracy_v1',1,true,now()),
  ('bahasa-match-case-bm','bahasa','bahasa-dasar-huruf','matching',2,'assessed',true,false,3,'bahasa.pack.huruf-besar-kecil','bahasa-huruf-besar-kecil','matching','matching_accuracy_v1',1,true,now()),
  ('bahasa-awal-bola','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',true,false,2,'bahasa.pack.bunyi-awal','bahasa-bunyi-awal','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-awal-kucing','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',false,false,2,'bahasa.pack.bunyi-awal','bahasa-bunyi-awal','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-awal-pisang','bahasa','bahasa-dasar-huruf','tap_choice',1,'assessed',false,false,2,'bahasa.pack.bunyi-awal','bahasa-bunyi-awal','tap_choice','choice_accuracy_v1',1,true,now()),
  ('bahasa-match-awal-tas-susu','bahasa','bahasa-dasar-huruf','matching',2,'assessed',true,false,3,'bahasa.pack.bunyi-awal','bahasa-bunyi-awal','matching','matching_accuracy_v1',1,true,now())
on conflict (activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id, skill_key, evidence_weight)
values
  ('bahasa-vokal-i','bahasa.vokal.recognition',1),('bahasa-vokal-u','bahasa.vokal.recognition',1),('bahasa-vokal-e','bahasa.vokal.recognition',1),('bahasa-vokal-o','bahasa.vokal.recognition',1),
  ('bahasa-dengar-i','bahasa.vokal.listening',1),('bahasa-dengar-u','bahasa.vokal.listening',1),('bahasa-dengar-e','bahasa.vokal.listening',1),('bahasa-dengar-o','bahasa.vokal.listening',1),
  ('bahasa-pilih-vokal-ae','bahasa.huruf.classification',1),('bahasa-pilih-vokal-io','bahasa.huruf.classification',1),('bahasa-pilih-konsonan-bd','bahasa.huruf.classification',1),('bahasa-pilih-konsonan-ks','bahasa.huruf.classification',1),
  ('bahasa-match-case-ai','bahasa.huruf.case_matching',1),('bahasa-match-case-uo','bahasa.huruf.case_matching',1),('bahasa-match-case-bm','bahasa.huruf.case_matching',1),
  ('bahasa-awal-bola','bahasa.bunyi.awal.recognition',1),('bahasa-awal-kucing','bahasa.bunyi.awal.recognition',1),('bahasa-awal-pisang','bahasa.bunyi.awal.recognition',1),('bahasa-match-awal-tas-susu','bahasa.bunyi.awal.recognition',1)
on conflict (activity_id, skill_key) do update set evidence_weight=excluded.evidence_weight;
