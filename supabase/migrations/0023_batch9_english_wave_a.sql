-- Mainlagi Expansion Batch 9 — English Wave A (subject total 6 -> 25)
-- Adds 19 reviewed English activities because the six historical English activities count toward the 1-25 boundary.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('english.alphabet.recognition','english','Recognize English letters','Mengenali simbol huruf English dan pasangan bentuk besar-kecilnya.','literacy',3,7,true,now()),
('english.alphabet.listening','english','Listen to letter names','Menghubungkan nama huruf English yang didengar dengan simbol yang benar.','language',3,7,true,now()),
('english.phonics.initial_sound','english','Notice initial sounds','Menghubungkan huruf awal dengan kata English sederhana.','literacy',4,7,true,now()),
('english.color.recognition','english','Recognize color words','Mengenali kata warna English dasar dan simbol warnanya.','language',4,7,true,now()),
('english.number.1_5','english','English numbers one to five','Menghubungkan ONE sampai FIVE dengan angka atau jumlah yang sesuai.','language',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('english.pack.alphabet-visual','english','english-first-steps','english-alphabet-basics','Alphabet Visual','1.0.0',3,7,'internal',true,now()),
('english.pack.alphabet-listening','english','english-first-steps','english-alphabet-basics','Listen to Letters','1.0.0',3,7,'internal',true,now()),
('english.pack.initial-sounds','english','english-first-steps','english-alphabet-basics','Initial Sounds','1.0.0',4,7,'internal',true,now()),
('english.pack.basic-colors','english','english-first-steps','english-alphabet-basics','Basic Colors','1.0.0',4,7,'internal',true,now()),
('english.pack.numbers-one-five','english','english-first-steps','english-alphabet-basics','Numbers One to Five','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('english-letter-a','english','english-alphabet-basics','tap_choice',1,'assessed',true,false,2,'english.pack.alphabet-visual','english-alphabet-visual','tap_choice','choice_accuracy_v1',1,true,now()),
('english-letter-b','english','english-alphabet-basics','tap_choice',1,'assessed',false,false,2,'english.pack.alphabet-visual','english-alphabet-visual','tap_choice','choice_accuracy_v1',1,true,now()),
('english-letter-m','english','english-alphabet-basics','tap_choice',1,'assessed',true,false,2,'english.pack.alphabet-visual','english-alphabet-visual','tap_choice','choice_accuracy_v1',1,true,now()),
('english-letter-s','english','english-alphabet-basics','tap_choice',1,'assessed',false,false,2,'english.pack.alphabet-visual','english-alphabet-visual','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-letter-a','english','english-alphabet-basics','listen_and_choose',1,'assessed',true,false,2,'english.pack.alphabet-listening','english-alphabet-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-listen-letter-m','english','english-alphabet-basics','listen_and_choose',1,'assessed',false,false,2,'english.pack.alphabet-listening','english-alphabet-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-case-ab','english','english-alphabet-basics','matching',2,'assessed',true,false,3,'english.pack.alphabet-listening','english-alphabet-listening','matching','matching_accuracy_v1',1,true,now()),
('english-match-case-ms','english','english-alphabet-basics','matching',2,'assessed',false,false,3,'english.pack.alphabet-listening','english-alphabet-listening','matching','matching_accuracy_v1',1,true,now()),
('english-initial-ball','english','english-alphabet-basics','tap_choice',1,'assessed',true,false,2,'english.pack.initial-sounds','english-initial-sounds','tap_choice','choice_accuracy_v1',1,true,now()),
('english-initial-sun','english','english-alphabet-basics','tap_choice',1,'assessed',false,false,2,'english.pack.initial-sounds','english-initial-sounds','tap_choice','choice_accuracy_v1',1,true,now()),
('english-match-initial-bc','english','english-alphabet-basics','matching',2,'assessed',true,false,3,'english.pack.initial-sounds','english-initial-sounds','matching','matching_accuracy_v1',1,true,now()),
('english-find-red','english','english-alphabet-basics','tap_choice',1,'assessed',true,false,2,'english.pack.basic-colors','english-basic-colors','tap_choice','choice_accuracy_v1',1,true,now()),
('english-find-green','english','english-alphabet-basics','tap_choice',1,'assessed',false,false,2,'english.pack.basic-colors','english-basic-colors','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-yellow','english','english-alphabet-basics','listen_and_choose',1,'assessed',true,false,2,'english.pack.basic-colors','english-basic-colors','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-colors-red-blue','english','english-alphabet-basics','matching',2,'assessed',false,false,3,'english.pack.basic-colors','english-basic-colors','matching','matching_accuracy_v1',1,true,now()),
('english-number-one','english','english-alphabet-basics','tap_choice',1,'assessed',true,false,2,'english.pack.numbers-one-five','english-numbers-one-five','tap_choice','choice_accuracy_v1',1,true,now()),
('english-number-two','english','english-alphabet-basics','tap_choice',1,'assessed',false,false,2,'english.pack.numbers-one-five','english-numbers-one-five','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-three','english','english-alphabet-basics','listen_and_choose',1,'assessed',true,false,2,'english.pack.numbers-one-five','english-numbers-one-five','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-four-five','english','english-alphabet-basics','matching',2,'assessed',true,false,3,'english.pack.numbers-one-five','english-numbers-one-five','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('english-letter-a','english.alphabet.recognition',1),('english-letter-b','english.alphabet.recognition',1),('english-letter-m','english.alphabet.recognition',1),('english-letter-s','english.alphabet.recognition',1),
('english-listen-letter-a','english.alphabet.listening',1),('english-listen-letter-m','english.alphabet.listening',1),
('english-match-case-ab','english.alphabet.recognition',1),('english-match-case-ms','english.alphabet.recognition',1),
('english-initial-ball','english.phonics.initial_sound',1),('english-initial-sun','english.phonics.initial_sound',1),('english-match-initial-bc','english.phonics.initial_sound',1),
('english-find-red','english.color.recognition',1),('english-find-green','english.color.recognition',1),('english-listen-yellow','english.color.recognition',1),('english-match-colors-red-blue','english.color.recognition',1),
('english-number-one','english.number.1_5',1),('english-number-two','english.number.1_5',1),('english-listen-three','english.number.1_5',1),('english-match-four-five','english.number.1_5',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
