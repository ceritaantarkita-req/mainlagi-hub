-- Mainlagi Expansion Batch 9 — English Wave D (subject total 75 -> 100)
-- Adds 25 reviewed English opposites, phrase, sentence, listening-comprehension, and integrated-review activities.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('english.relation.opposites','english','Recognize opposites','Mengenali pasangan lawan kata English sederhana.','language',5,7,true,now()),
('english.phrase.literal','english','Understand simple phrases','Memahami makna literal frasa English pendek.','language',5,7,true,now()),
('english.sentence.completion','english','Complete simple sentences','Melengkapi kalimat English pendek dengan kata yang sesuai konteks.','literacy',5,7,true,now()),
('english.sentence.listening_detail','english','Listen for sentence details','Menentukan detail literal dari kalimat English pendek yang didengar.','language',5,7,true,now()),
('english.review.integration','english','Integrated English review','Menggunakan beberapa kemampuan English dasar secara terpadu.','language',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('english.pack.opposites','english','english-first-steps','english-phrases-review','Opposites','1.0.0',5,7,'internal',true,now()),
('english.pack.simple-phrases','english','english-first-steps','english-phrases-review','Simple Phrases','1.0.0',5,7,'internal',true,now()),
('english.pack.sentence-completion','english','english-first-steps','english-phrases-review','Complete Sentences','1.0.0',5,7,'internal',true,now()),
('english.pack.listening-comprehension','english','english-first-steps','english-phrases-review','Listening Comprehension','1.0.0',5,7,'internal',true,now()),
('english.pack.integrated-review','english','english-first-steps','english-phrases-review','Integrated Review','1.0.0',5,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('english-opposite-big-small','english','english-phrases-review','tap_choice',3,'assessed',true,false,3,'english.pack.opposites','english-opposites','tap_choice','choice_accuracy_v1',1,true,now()),
('english-opposite-hot-cold','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.opposites','english-opposites','tap_choice','choice_accuracy_v1',1,true,now()),
('english-opposite-up-down','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.opposites','english-opposites','tap_choice','choice_accuracy_v1',1,true,now()),
('english-match-opposites-fast-slow','english','english-phrases-review','matching',3,'assessed',true,false,3,'english.pack.opposites','english-opposites','matching','matching_accuracy_v1',1,true,now()),
('english-match-opposites-happy-sad','english','english-phrases-review','matching',3,'assessed',false,false,3,'english.pack.opposites','english-opposites','matching','matching_accuracy_v1',1,true,now()),
('english-phrase-red-ball','english','english-phrases-review','tap_choice',3,'assessed',true,false,3,'english.pack.simple-phrases','english-simple-phrases','tap_choice','choice_accuracy_v1',1,true,now()),
('english-phrase-two-books','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.simple-phrases','english-simple-phrases','tap_choice','choice_accuracy_v1',1,true,now()),
('english-phrase-small-cat','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.simple-phrases','english-simple-phrases','tap_choice','choice_accuracy_v1',1,true,now()),
('english-phrase-yellow-banana','english','english-phrases-review','tap_choice',3,'assessed',true,false,3,'english.pack.simple-phrases','english-simple-phrases','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-phrase-blue-book','english','english-phrases-review','listen_and_choose',3,'assessed',true,false,3,'english.pack.simple-phrases','english-simple-phrases','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-complete-cat-sleeps','english','english-phrases-review','tap_choice',3,'assessed',true,false,3,'english.pack.sentence-completion','english-sentence-completion','tap_choice','choice_accuracy_v1',1,true,now()),
('english-complete-bird-flies','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.sentence-completion','english-sentence-completion','tap_choice','choice_accuracy_v1',1,true,now()),
('english-complete-i-read','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.sentence-completion','english-sentence-completion','tap_choice','choice_accuracy_v1',1,true,now()),
('english-complete-two-apples','english','english-phrases-review','tap_choice',3,'assessed',true,false,3,'english.pack.sentence-completion','english-sentence-completion','tap_choice','choice_accuracy_v1',1,true,now()),
('english-complete-mother-family','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.sentence-completion','english-sentence-completion','tap_choice','choice_accuracy_v1',1,true,now()),
('english-detail-red-ball','english','english-phrases-review','listen_and_choose',3,'assessed',true,false,3,'english.pack.listening-comprehension','english-listening-comprehension','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-detail-two-books','english','english-phrases-review','listen_and_choose',3,'assessed',false,false,3,'english.pack.listening-comprehension','english-listening-comprehension','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-detail-dog-runs','english','english-phrases-review','listen_and_choose',3,'assessed',false,false,3,'english.pack.listening-comprehension','english-listening-comprehension','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-detail-baby-sleeps','english','english-phrases-review','listen_and_choose',3,'assessed',true,false,3,'english.pack.listening-comprehension','english-listening-comprehension','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-detail-bird-up','english','english-phrases-review','listen_and_choose',3,'assessed',false,false,3,'english.pack.listening-comprehension','english-listening-comprehension','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-review-letter-s','english','english-phrases-review','tap_choice',3,'assessed',true,false,3,'english.pack.integrated-review','english-integrated-review','tap_choice','choice_accuracy_v1',1,true,now()),
('english-review-number-five','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.integrated-review','english-integrated-review','tap_choice','choice_accuracy_v1',1,true,now()),
('english-review-category-action','english','english-phrases-review','tap_choice',3,'assessed',false,false,3,'english.pack.integrated-review','english-integrated-review','tap_choice','choice_accuracy_v1',1,true,now()),
('english-review-listen-yellow-ball','english','english-phrases-review','listen_and_choose',3,'assessed',true,false,3,'english.pack.integrated-review','english-integrated-review','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-review-match-final','english','english-phrases-review','matching',3,'assessed',true,false,3,'english.pack.integrated-review','english-integrated-review','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('english-opposite-big-small','english.relation.opposites',1),('english-opposite-hot-cold','english.relation.opposites',1),('english-opposite-up-down','english.relation.opposites',1),('english-match-opposites-fast-slow','english.relation.opposites',1),('english-match-opposites-happy-sad','english.relation.opposites',1),
('english-phrase-red-ball','english.phrase.literal',1),('english-phrase-two-books','english.phrase.literal',1),('english-phrase-small-cat','english.phrase.literal',1),('english-phrase-yellow-banana','english.phrase.literal',1),('english-listen-phrase-blue-book','english.phrase.literal',1),
('english-complete-cat-sleeps','english.sentence.completion',1),('english-complete-bird-flies','english.sentence.completion',1),('english-complete-i-read','english.sentence.completion',1),('english-complete-two-apples','english.sentence.completion',1),('english-complete-mother-family','english.sentence.completion',1),
('english-detail-red-ball','english.sentence.listening_detail',1),('english-detail-two-books','english.sentence.listening_detail',1),('english-detail-dog-runs','english.sentence.listening_detail',1),('english-detail-baby-sleeps','english.sentence.listening_detail',1),('english-detail-bird-up','english.sentence.listening_detail',1),
('english-review-letter-s','english.review.integration',1),('english-review-number-five','english.review.integration',1),('english-review-category-action','english.review.integration',1),('english-review-listen-yellow-ball','english.review.integration',1),('english-review-match-final','english.review.integration',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
