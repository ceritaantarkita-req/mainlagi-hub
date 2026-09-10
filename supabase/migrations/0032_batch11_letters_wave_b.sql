-- Mainlagi Expansion Batch 11 — Letters/Menulis Wave B (subject total 25 -> 50)
-- Adds 25 meaningful activities: 22 measured recognition/matching/sequence/discrimination + 3 completion-only letter-formation practices.
-- Letter tracing remains practice-only until a validated Latin letter-shape fidelity evaluator exists.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('letters.latin.uppercase.recognition.middle','letters','Mengenali huruf besar G–M','Mengenali bentuk huruf besar G sampai M.','literacy',4,7,true,now()),
('letters.latin.lowercase.recognition.middle','letters','Mengenali huruf kecil g–m','Mengenali bentuk huruf kecil g sampai m.','literacy',4,7,true,now()),
('letters.latin.case_matching.middle','letters','Pasangan bentuk G–M','Memasangkan huruf besar dan kecil pada rentang G sampai M.','literacy',4,7,true,now()),
('letters.latin.sequence.middle','letters','Urutan alfabet G–M','Menentukan posisi sebelum, sesudah, dan di antara huruf pada rentang G sampai M.','literacy',4,7,true,now()),
('letters.latin.visual_discrimination.middle','letters','Diskriminasi visual huruf tengah','Membedakan bentuk huruf G–M yang memiliki ciri visual serupa.','literacy',4,7,true,now()),
('letters.latin.formation.practice.middle','letters','Praktik pembentukan G, I, M','Praktik motorik membentuk G, I, dan M tanpa klaim akurasi atau mastery.','motor',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('letters.pack.uppercase-g-m','letters','letters-writing-foundations','letters-middle-alphabet','Uppercase G–M','1.0.0',4,7,'internal',true,now()),
('letters.pack.lowercase-g-m','letters','letters-writing-foundations','letters-middle-alphabet','Lowercase g–m','1.0.0',4,7,'internal',true,now()),
('letters.pack.case-matching-middle','letters','letters-writing-foundations','letters-middle-alphabet','Middle Case Matching','1.0.0',4,7,'internal',true,now()),
('letters.pack.sequence-g-m','letters','letters-writing-foundations','letters-middle-alphabet','Alphabet Sequence G–M','1.0.0',4,7,'internal',true,now()),
('letters.pack.visual-discrimination-middle','letters','letters-writing-foundations','letters-middle-alphabet','Middle Letter Visual Discrimination','1.0.0',4,7,'internal',true,now()),
('letters.pack.formation-middle-practice','letters','letters-writing-foundations','letters-middle-alphabet','Middle Letter Formation Practice','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('letters-find-upper-g','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-h','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-i','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-j','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-k','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-l','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-m','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-g-m','letters-uppercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-g','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-h','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-i','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-j','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-k','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-l','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-m','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-g-m','letters-lowercase-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-match-case-gh','letters','letters-middle-alphabet','matching',2,'assessed',true,false,3,'letters.pack.case-matching-middle','letters-case-matching-middle','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-ij','letters','letters-middle-alphabet','matching',2,'assessed',false,false,3,'letters.pack.case-matching-middle','letters-case-matching-middle','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-klm','letters','letters-middle-alphabet','matching',2,'assessed',true,false,3,'letters.pack.case-matching-middle','letters-case-matching-middle','matching','matching_accuracy_v1',1,true,now()),
('letters-order-after-g','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-g-m','letters-sequence-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-between-jl','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-g-m','letters-sequence-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-before-m','letters','letters-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.sequence-g-m','letters-sequence-g-m','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-upper-gc','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-middle','letters-visual-discrimination-middle','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-gq','letters','letters-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-middle','letters-visual-discrimination-middle','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-trace-g-practice','letters','letters-middle-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-middle-practice','letters-formation-middle-practice','guided_trace','completion_only_v1',1,true,now()),
('letters-trace-i-practice','letters','letters-middle-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-middle-practice','letters-formation-middle-practice','guided_trace','completion_only_v1',1,true,now()),
('letters-trace-m-practice','letters','letters-middle-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-middle-practice','letters-formation-middle-practice','guided_trace','completion_only_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('letters-find-upper-g','letters.latin.uppercase.recognition.middle',1),('letters-find-upper-h','letters.latin.uppercase.recognition.middle',1),('letters-find-upper-i','letters.latin.uppercase.recognition.middle',1),('letters-find-upper-j','letters.latin.uppercase.recognition.middle',1),('letters-find-upper-k','letters.latin.uppercase.recognition.middle',1),('letters-find-upper-l','letters.latin.uppercase.recognition.middle',1),('letters-find-upper-m','letters.latin.uppercase.recognition.middle',1),
('letters-find-lower-g','letters.latin.lowercase.recognition.middle',1),('letters-find-lower-h','letters.latin.lowercase.recognition.middle',1),('letters-find-lower-i','letters.latin.lowercase.recognition.middle',1),('letters-find-lower-j','letters.latin.lowercase.recognition.middle',1),('letters-find-lower-k','letters.latin.lowercase.recognition.middle',1),('letters-find-lower-l','letters.latin.lowercase.recognition.middle',1),('letters-find-lower-m','letters.latin.lowercase.recognition.middle',1),
('letters-match-case-gh','letters.latin.case_matching.middle',1),('letters-match-case-ij','letters.latin.case_matching.middle',1),('letters-match-case-klm','letters.latin.case_matching.middle',1),
('letters-order-after-g','letters.latin.sequence.middle',1),('letters-order-between-jl','letters.latin.sequence.middle',1),('letters-order-before-m','letters.latin.sequence.middle',1),
('letters-discriminate-upper-gc','letters.latin.visual_discrimination.middle',1),('letters-discriminate-lower-gq','letters.latin.visual_discrimination.middle',1),
('letters-trace-g-practice','letters.latin.formation.practice.middle',0.4),('letters-trace-i-practice','letters.latin.formation.practice.middle',0.4),('letters-trace-m-practice','letters.latin.formation.practice.middle',0.4)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
