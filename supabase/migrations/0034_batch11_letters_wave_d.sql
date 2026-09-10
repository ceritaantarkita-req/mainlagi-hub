-- Mainlagi Expansion Batch 11 — Letters/Menulis Wave D (subject total 75 -> 100)
-- Adds 25 meaningful activities: 22 assessed recognition/matching/sequence/discrimination + 3 completion-only formation practices.
-- Latin tracing remains practice-only until a validated letter-shape fidelity evaluator exists.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('letters.latin.uppercase.recognition.final','letters','Mengenali huruf besar U–Z','Mengenali bentuk huruf besar U sampai Z.','literacy',4,7,true,now()),
('letters.latin.lowercase.recognition.final','letters','Mengenali huruf kecil u–z','Mengenali bentuk huruf kecil u sampai z.','literacy',4,7,true,now()),
('letters.latin.case_matching.final','letters','Pasangan bentuk U–Z','Memasangkan huruf besar dan kecil pada rentang U sampai Z.','literacy',4,7,true,now()),
('letters.latin.sequence.final','letters','Urutan alfabet U–Z','Menentukan posisi huruf pada bagian akhir alfabet U sampai Z.','literacy',4,7,true,now()),
('letters.latin.visual_discrimination.final','letters','Diskriminasi visual U–Z','Membedakan bentuk huruf yang mirip pada rentang U sampai Z.','literacy',4,7,true,now()),
('letters.latin.formation.practice.final','letters','Praktik pembentukan U, W, Z','Praktik motorik membentuk U, W, dan Z tanpa klaim akurasi atau mastery.','motor',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('letters.pack.uppercase-u-z','letters','letters-writing-foundations','letters-final-alphabet','Uppercase U–Z','1.0.0',4,7,'internal',true,now()),
('letters.pack.lowercase-u-z','letters','letters-writing-foundations','letters-final-alphabet','Lowercase u–z','1.0.0',4,7,'internal',true,now()),
('letters.pack.case-matching-final','letters','letters-writing-foundations','letters-final-alphabet','Final Case Matching','1.0.0',4,7,'internal',true,now()),
('letters.pack.sequence-u-z','letters','letters-writing-foundations','letters-final-alphabet','Alphabet Sequence U–Z','1.0.0',4,7,'internal',true,now()),
('letters.pack.visual-discrimination-final','letters','letters-writing-foundations','letters-final-alphabet','Final Visual Discrimination','1.0.0',4,7,'internal',true,now()),
('letters.pack.formation-final-practice','letters','letters-writing-foundations','letters-final-alphabet','Final Formation Practice','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('letters-find-upper-u','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-u-z','letters-uppercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-v','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-u-z','letters-uppercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-w','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-u-z','letters-uppercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-x','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-u-z','letters-uppercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-y','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-u-z','letters-uppercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-z','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-u-z','letters-uppercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-u','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-u-z','letters-lowercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-v','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-u-z','letters-lowercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-w','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-u-z','letters-lowercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-x','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-u-z','letters-lowercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-y','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-u-z','letters-lowercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-z','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-u-z','letters-lowercase-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-match-case-uv','letters','letters-final-alphabet','matching',2,'assessed',true,false,3,'letters.pack.case-matching-final','letters-case-matching-final','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-wx','letters','letters-final-alphabet','matching',2,'assessed',false,false,3,'letters.pack.case-matching-final','letters-case-matching-final','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-yz','letters','letters-final-alphabet','matching',2,'assessed',true,false,3,'letters.pack.case-matching-final','letters-case-matching-final','matching','matching_accuracy_v1',1,true,now()),
('letters-order-after-u','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-u-z','letters-sequence-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-between-vx','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-u-z','letters-sequence-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-before-z','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-u-z','letters-sequence-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-end-wxyz','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.sequence-u-z','letters-sequence-u-z','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-upper-vy-final','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-final','letters-visual-discrimination-final','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-uv-final','letters','letters-final-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-final','letters-visual-discrimination-final','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-wm-final','letters','letters-final-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.visual-discrimination-final','letters-visual-discrimination-final','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-trace-u-practice','letters','letters-final-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-final-practice','letters-formation-final-practice','guided_trace','completion_only_v1',1,true,now()),
('letters-trace-w-practice','letters','letters-final-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-final-practice','letters-formation-final-practice','guided_trace','completion_only_v1',1,true,now()),
('letters-trace-z-practice','letters','letters-final-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-final-practice','letters-formation-final-practice','guided_trace','completion_only_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('letters-find-upper-u','letters.latin.uppercase.recognition.final',1),('letters-find-upper-v','letters.latin.uppercase.recognition.final',1),('letters-find-upper-w','letters.latin.uppercase.recognition.final',1),('letters-find-upper-x','letters.latin.uppercase.recognition.final',1),('letters-find-upper-y','letters.latin.uppercase.recognition.final',1),('letters-find-upper-z','letters.latin.uppercase.recognition.final',1),
('letters-find-lower-u','letters.latin.lowercase.recognition.final',1),('letters-find-lower-v','letters.latin.lowercase.recognition.final',1),('letters-find-lower-w','letters.latin.lowercase.recognition.final',1),('letters-find-lower-x','letters.latin.lowercase.recognition.final',1),('letters-find-lower-y','letters.latin.lowercase.recognition.final',1),('letters-find-lower-z','letters.latin.lowercase.recognition.final',1),
('letters-match-case-uv','letters.latin.case_matching.final',1),('letters-match-case-wx','letters.latin.case_matching.final',1),('letters-match-case-yz','letters.latin.case_matching.final',1),
('letters-order-after-u','letters.latin.sequence.final',1),('letters-order-between-vx','letters.latin.sequence.final',1),('letters-order-before-z','letters.latin.sequence.final',1),('letters-order-end-wxyz','letters.latin.sequence.final',1),
('letters-discriminate-upper-vy-final','letters.latin.visual_discrimination.final',1),('letters-discriminate-lower-uv-final','letters.latin.visual_discrimination.final',1),('letters-discriminate-lower-wm-final','letters.latin.visual_discrimination.final',1),
('letters-trace-u-practice','letters.latin.formation.practice.final',0.4),('letters-trace-w-practice','letters.latin.formation.practice.final',0.4),('letters-trace-z-practice','letters.latin.formation.practice.final',0.4)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
