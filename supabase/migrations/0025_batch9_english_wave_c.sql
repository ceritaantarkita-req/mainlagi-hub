-- Mainlagi Expansion Batch 9 — English Wave C (subject total 50 -> 75)
-- Adds 25 reviewed English food, action, category, word-picture, and listening activities.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('english.vocab.food','english','Food vocabulary','Mengenali makanan dan minuman English sederhana.','language',4,7,true,now()),
('english.vocab.actions','english','Action vocabulary','Mengenali kata kerja English sederhana melalui konteks familiar.','language',4,7,true,now()),
('english.vocab.category','english','Categorize English words','Membedakan kosakata berdasarkan kategori makna sederhana.','language',5,7,true,now()),
('english.word.picture_matching','english','Expanded word-picture matching','Menghubungkan kata English dengan gambar yang tepat pada lebih banyak kategori.','literacy',4,7,true,now()),
('english.word.listening','english','Expanded word listening','Mengidentifikasi kata English yang didengar dari beberapa pilihan.','language',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('english.pack.food','english','english-first-steps','english-words-actions','Food Words','1.0.0',4,7,'internal',true,now()),
('english.pack.actions','english','english-first-steps','english-words-actions','Action Words','1.0.0',4,7,'internal',true,now()),
('english.pack.categories','english','english-first-steps','english-words-actions','Word Categories','1.0.0',5,7,'internal',true,now()),
('english.pack.word-picture-expanded','english','english-first-steps','english-words-actions','Word & Picture Expanded','1.0.0',4,7,'internal',true,now()),
('english.pack.listening-expanded','english','english-first-steps','english-words-actions','Listen & Identify','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('english-food-apple','english','english-words-actions','tap_choice',2,'assessed',true,false,3,'english.pack.food','english-food','tap_choice','choice_accuracy_v1',1,true,now()),
('english-food-banana','english','english-words-actions','tap_choice',2,'assessed',false,false,3,'english.pack.food','english-food','tap_choice','choice_accuracy_v1',1,true,now()),
('english-food-bread','english','english-words-actions','tap_choice',2,'assessed',false,false,3,'english.pack.food','english-food','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-milk','english','english-words-actions','listen_and_choose',2,'assessed',true,false,3,'english.pack.food','english-food','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-food-rice-apple','english','english-words-actions','matching',2,'assessed',true,false,3,'english.pack.food','english-food','matching','matching_accuracy_v1',1,true,now()),
('english-action-run','english','english-words-actions','tap_choice',2,'assessed',true,false,3,'english.pack.actions','english-actions','tap_choice','choice_accuracy_v1',1,true,now()),
('english-action-jump','english','english-words-actions','tap_choice',2,'assessed',false,false,3,'english.pack.actions','english-actions','tap_choice','choice_accuracy_v1',1,true,now()),
('english-action-read','english','english-words-actions','tap_choice',2,'assessed',false,false,3,'english.pack.actions','english-actions','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-sleep','english','english-words-actions','listen_and_choose',2,'assessed',true,false,3,'english.pack.actions','english-actions','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-actions-eat-read','english','english-words-actions','matching',2,'assessed',true,false,3,'english.pack.actions','english-actions','matching','matching_accuracy_v1',1,true,now()),
('english-category-food','english','english-words-actions','tap_choice',2,'assessed',true,false,3,'english.pack.categories','english-categories','tap_choice','choice_accuracy_v1',1,true,now()),
('english-category-animal','english','english-words-actions','tap_choice',2,'assessed',false,false,3,'english.pack.categories','english-categories','tap_choice','choice_accuracy_v1',1,true,now()),
('english-category-action','english','english-words-actions','tap_choice',2,'assessed',false,false,3,'english.pack.categories','english-categories','tap_choice','choice_accuracy_v1',1,true,now()),
('english-match-category-body-object','english','english-words-actions','matching',3,'assessed',true,false,3,'english.pack.categories','english-categories','matching','matching_accuracy_v1',1,true,now()),
('english-match-category-food-animal','english','english-words-actions','matching',3,'assessed',false,false,3,'english.pack.categories','english-categories','matching','matching_accuracy_v1',1,true,now()),
('english-picture-pair-apple-banana','english','english-words-actions','matching',2,'assessed',true,false,3,'english.pack.word-picture-expanded','english-word-picture-expanded','matching','matching_accuracy_v1',1,true,now()),
('english-picture-pair-run-sleep','english','english-words-actions','matching',2,'assessed',false,false,3,'english.pack.word-picture-expanded','english-word-picture-expanded','matching','matching_accuracy_v1',1,true,now()),
('english-picture-pair-book-cup','english','english-words-actions','matching',2,'assessed',false,false,3,'english.pack.word-picture-expanded','english-word-picture-expanded','matching','matching_accuracy_v1',1,true,now()),
('english-picture-pair-eyes-hand','english','english-words-actions','matching',2,'assessed',true,false,3,'english.pack.word-picture-expanded','english-word-picture-expanded','matching','matching_accuracy_v1',1,true,now()),
('english-picture-pair-mother-baby','english','english-words-actions','matching',2,'assessed',false,false,3,'english.pack.word-picture-expanded','english-word-picture-expanded','matching','matching_accuracy_v1',1,true,now()),
('english-listen-apple-review','english','english-words-actions','listen_and_choose',2,'assessed',true,false,3,'english.pack.listening-expanded','english-listening-expanded','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-listen-jump-review','english','english-words-actions','listen_and_choose',2,'assessed',false,false,3,'english.pack.listening-expanded','english-listening-expanded','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-listen-book-review','english','english-words-actions','listen_and_choose',2,'assessed',false,false,3,'english.pack.listening-expanded','english-listening-expanded','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-listen-hand-review','english','english-words-actions','listen_and_choose',2,'assessed',true,false,3,'english.pack.listening-expanded','english-listening-expanded','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-listen-baby-review','english','english-words-actions','listen_and_choose',2,'assessed',false,false,3,'english.pack.listening-expanded','english-listening-expanded','listen_and_choose','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('english-food-apple','english.vocab.food',1),('english-food-banana','english.vocab.food',1),('english-food-bread','english.vocab.food',1),('english-listen-milk','english.vocab.food',1),('english-match-food-rice-apple','english.vocab.food',1),
('english-action-run','english.vocab.actions',1),('english-action-jump','english.vocab.actions',1),('english-action-read','english.vocab.actions',1),('english-listen-sleep','english.vocab.actions',1),('english-match-actions-eat-read','english.vocab.actions',1),
('english-category-food','english.vocab.category',1),('english-category-animal','english.vocab.category',1),('english-category-action','english.vocab.category',1),('english-match-category-body-object','english.vocab.category',1),('english-match-category-food-animal','english.vocab.category',1),
('english-picture-pair-apple-banana','english.word.picture_matching',1),('english-picture-pair-run-sleep','english.word.picture_matching',1),('english-picture-pair-book-cup','english.word.picture_matching',1),('english-picture-pair-eyes-hand','english.word.picture_matching',1),('english-picture-pair-mother-baby','english.word.picture_matching',1),
('english-listen-apple-review','english.word.listening',1),('english-listen-jump-review','english.word.listening',1),('english-listen-book-review','english.word.listening',1),('english-listen-hand-review','english.word.listening',1),('english-listen-baby-review','english.word.listening',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
