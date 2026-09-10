-- Mainlagi Expansion Batch 11 — Letters/Menulis Wave C (subject total 50 -> 75)
-- 22 assessed recognition/matching/sequence/discrimination + 3 completion-only formation practices.
-- Additive/idempotent; Latin trace completion is not letter-shape mastery.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('letters.latin.uppercase.recognition.late_middle','letters','Mengenali huruf besar N–T','Mengenali bentuk huruf besar N sampai T.','literacy',4,7,true,now()),
('letters.latin.lowercase.recognition.late_middle','letters','Mengenali huruf kecil n–t','Mengenali bentuk huruf kecil n sampai t.','literacy',4,7,true,now()),
('letters.latin.case_matching.late_middle','letters','Pasangan bentuk N–T','Memasangkan huruf besar dan kecil pada rentang N sampai T.','literacy',4,7,true,now()),
('letters.latin.sequence.late_middle','letters','Urutan alfabet N–T','Menentukan posisi huruf pada rentang N sampai T.','literacy',4,7,true,now()),
('letters.latin.visual_discrimination.late_middle','letters','Diskriminasi visual N–T','Membedakan bentuk huruf yang mirip pada rentang N sampai T.','literacy',4,7,true,now()),
('letters.latin.formation.practice.late_middle','letters','Praktik pembentukan N, O, T','Praktik motorik membentuk N, O, dan T tanpa klaim akurasi atau mastery.','motor',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('letters.pack.uppercase-n-t','letters','letters-writing-foundations','letters-late-middle-alphabet','Uppercase N–T','1.0.0',4,7,'internal',true,now()),
('letters.pack.lowercase-n-t','letters','letters-writing-foundations','letters-late-middle-alphabet','Lowercase n–t','1.0.0',4,7,'internal',true,now()),
('letters.pack.case-matching-late-middle','letters','letters-writing-foundations','letters-late-middle-alphabet','Late-middle Case Matching','1.0.0',4,7,'internal',true,now()),
('letters.pack.sequence-n-t','letters','letters-writing-foundations','letters-late-middle-alphabet','Alphabet Sequence N–T','1.0.0',4,7,'internal',true,now()),
('letters.pack.visual-discrimination-late-middle','letters','letters-writing-foundations','letters-late-middle-alphabet','Late-middle Visual Discrimination','1.0.0',4,7,'internal',true,now()),
('letters.pack.formation-late-middle-practice','letters','letters-writing-foundations','letters-late-middle-alphabet','Late-middle Formation Practice','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('letters-find-upper-n','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-o','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-p','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-q','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-r','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-s','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-t','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.uppercase-n-t','letters-uppercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-n','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-o','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-p','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-q','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-r','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-s','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-t','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.lowercase-n-t','letters-lowercase-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-match-case-no','letters','letters-late-middle-alphabet','matching',2,'assessed',true,false,3,'letters.pack.case-matching-late-middle','letters-case-matching-late-middle','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-pq','letters','letters-late-middle-alphabet','matching',2,'assessed',false,false,3,'letters.pack.case-matching-late-middle','letters-case-matching-late-middle','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-rst','letters','letters-late-middle-alphabet','matching',2,'assessed',true,false,3,'letters.pack.case-matching-late-middle','letters-case-matching-late-middle','matching','matching_accuracy_v1',1,true,now()),
('letters-order-after-n','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-n-t','letters-sequence-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-between-pr','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.sequence-n-t','letters-sequence-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-order-before-t','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',false,false,3,'letters.pack.sequence-n-t','letters-sequence-n-t','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-upper-oq','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-late-middle','letters-visual-discrimination-late-middle','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-pq','letters','letters-late-middle-alphabet','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-late-middle','letters-visual-discrimination-late-middle','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-trace-n-practice','letters','letters-late-middle-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-late-middle-practice','letters-formation-late-middle-practice','guided_trace','completion_only_v1',1,true,now()),
('letters-trace-o-practice','letters','letters-late-middle-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-late-middle-practice','letters-formation-late-middle-practice','guided_trace','completion_only_v1',1,true,now()),
('letters-trace-t-practice','letters','letters-late-middle-alphabet','trace',2,'practice',false,false,3,'letters.pack.formation-late-middle-practice','letters-formation-late-middle-practice','guided_trace','completion_only_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('letters-find-upper-n','letters.latin.uppercase.recognition.late_middle',1),('letters-find-upper-o','letters.latin.uppercase.recognition.late_middle',1),('letters-find-upper-p','letters.latin.uppercase.recognition.late_middle',1),('letters-find-upper-q','letters.latin.uppercase.recognition.late_middle',1),('letters-find-upper-r','letters.latin.uppercase.recognition.late_middle',1),('letters-find-upper-s','letters.latin.uppercase.recognition.late_middle',1),('letters-find-upper-t','letters.latin.uppercase.recognition.late_middle',1),
('letters-find-lower-n','letters.latin.lowercase.recognition.late_middle',1),('letters-find-lower-o','letters.latin.lowercase.recognition.late_middle',1),('letters-find-lower-p','letters.latin.lowercase.recognition.late_middle',1),('letters-find-lower-q','letters.latin.lowercase.recognition.late_middle',1),('letters-find-lower-r','letters.latin.lowercase.recognition.late_middle',1),('letters-find-lower-s','letters.latin.lowercase.recognition.late_middle',1),('letters-find-lower-t','letters.latin.lowercase.recognition.late_middle',1),
('letters-match-case-no','letters.latin.case_matching.late_middle',1),('letters-match-case-pq','letters.latin.case_matching.late_middle',1),('letters-match-case-rst','letters.latin.case_matching.late_middle',1),
('letters-order-after-n','letters.latin.sequence.late_middle',1),('letters-order-between-pr','letters.latin.sequence.late_middle',1),('letters-order-before-t','letters.latin.sequence.late_middle',1),
('letters-discriminate-upper-oq','letters.latin.visual_discrimination.late_middle',1),('letters-discriminate-lower-pq','letters.latin.visual_discrimination.late_middle',1),
('letters-trace-n-practice','letters.latin.formation.practice.late_middle',0.4),('letters-trace-o-practice','letters.latin.formation.practice.late_middle',0.4),('letters-trace-t-practice','letters.latin.formation.practice.late_middle',0.4)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
