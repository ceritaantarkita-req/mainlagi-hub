-- Mainlagi Expansion Batch 9 — English Wave B (subject total 25 -> 50)
-- Adds 25 reviewed English everyday-vocabulary activities.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('english.vocab.animals','english','Animal vocabulary','Mengenali nama hewan English sederhana dari kata, gambar, dan audio.','language',3,7,true,now()),
('english.vocab.objects','english','Object vocabulary','Mengenali kata English untuk benda sehari-hari yang familiar.','language',4,7,true,now()),
('english.vocab.body','english','Body vocabulary','Mengenali bagian tubuh dasar dalam English.','language',4,7,true,now()),
('english.vocab.family','english','Family vocabulary','Mengenali kata keluarga dasar dalam English.','language',4,7,true,now()),
('english.vocab.everyday_integration','english','Integrate everyday words','Menggunakan kosakata dari beberapa kategori English secara terpadu.','language',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('english.pack.animals','english','english-first-steps','english-everyday-words','Animals','1.0.0',3,7,'internal',true,now()),
('english.pack.objects','english','english-first-steps','english-everyday-words','Everyday Objects','1.0.0',4,7,'internal',true,now()),
('english.pack.body','english','english-first-steps','english-everyday-words','Body Parts','1.0.0',4,7,'internal',true,now()),
('english.pack.family','english','english-first-steps','english-everyday-words','Family Words','1.0.0',4,7,'internal',true,now()),
('english.pack.everyday-review','english','english-first-steps','english-everyday-words','Everyday Review','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('english-animal-dog','english','english-everyday-words','tap_choice',2,'assessed',true,false,3,'english.pack.animals','english-animals','tap_choice','choice_accuracy_v1',1,true,now()),
('english-animal-rabbit','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.animals','english-animals','tap_choice','choice_accuracy_v1',1,true,now()),
('english-animal-fish','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.animals','english-animals','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-bird','english','english-everyday-words','listen_and_choose',2,'assessed',true,false,3,'english.pack.animals','english-animals','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-animals-dog-rabbit','english','english-everyday-words','matching',2,'assessed',true,false,3,'english.pack.animals','english-animals','matching','matching_accuracy_v1',1,true,now()),
('english-object-book','english','english-everyday-words','tap_choice',2,'assessed',true,false,3,'english.pack.objects','english-objects','tap_choice','choice_accuracy_v1',1,true,now()),
('english-object-chair','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.objects','english-objects','tap_choice','choice_accuracy_v1',1,true,now()),
('english-object-cup','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.objects','english-objects','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-bag','english','english-everyday-words','listen_and_choose',2,'assessed',true,false,3,'english.pack.objects','english-objects','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-objects-book-ball','english','english-everyday-words','matching',2,'assessed',true,false,3,'english.pack.objects','english-objects','matching','matching_accuracy_v1',1,true,now()),
('english-body-head','english','english-everyday-words','tap_choice',2,'assessed',true,false,3,'english.pack.body','english-body','tap_choice','choice_accuracy_v1',1,true,now()),
('english-body-hand','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.body','english-body','tap_choice','choice_accuracy_v1',1,true,now()),
('english-body-foot','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.body','english-body','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-eyes','english','english-everyday-words','listen_and_choose',2,'assessed',true,false,3,'english.pack.body','english-body','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-body-eyes-ears','english','english-everyday-words','matching',2,'assessed',true,false,3,'english.pack.body','english-body','matching','matching_accuracy_v1',1,true,now()),
('english-family-mother','english','english-everyday-words','tap_choice',2,'assessed',true,false,3,'english.pack.family','english-family','tap_choice','choice_accuracy_v1',1,true,now()),
('english-family-father','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.family','english-family','tap_choice','choice_accuracy_v1',1,true,now()),
('english-family-baby','english','english-everyday-words','tap_choice',2,'assessed',false,false,3,'english.pack.family','english-family','tap_choice','choice_accuracy_v1',1,true,now()),
('english-listen-sister','english','english-everyday-words','listen_and_choose',2,'assessed',true,false,3,'english.pack.family','english-family','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-match-family-siblings','english','english-everyday-words','matching',2,'assessed',true,false,3,'english.pack.family','english-family','matching','matching_accuracy_v1',1,true,now()),
('english-review-word-book','english','english-everyday-words','tap_choice',2,'assessed',true,false,3,'english.pack.everyday-review','english-everyday-review','tap_choice','choice_accuracy_v1',1,true,now()),
('english-review-listen-father','english','english-everyday-words','listen_and_choose',2,'assessed',false,false,3,'english.pack.everyday-review','english-everyday-review','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-review-listen-fish','english','english-everyday-words','listen_and_choose',2,'assessed',false,false,3,'english.pack.everyday-review','english-everyday-review','listen_and_choose','choice_accuracy_v1',1,true,now()),
('english-review-match-animal-object','english','english-everyday-words','matching',2,'assessed',true,false,3,'english.pack.everyday-review','english-everyday-review','matching','matching_accuracy_v1',1,true,now()),
('english-review-match-body-family','english','english-everyday-words','matching',2,'assessed',false,false,3,'english.pack.everyday-review','english-everyday-review','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('english-animal-dog','english.vocab.animals',1),('english-animal-rabbit','english.vocab.animals',1),('english-animal-fish','english.vocab.animals',1),('english-listen-bird','english.vocab.animals',1),('english-match-animals-dog-rabbit','english.vocab.animals',1),
('english-object-book','english.vocab.objects',1),('english-object-chair','english.vocab.objects',1),('english-object-cup','english.vocab.objects',1),('english-listen-bag','english.vocab.objects',1),('english-match-objects-book-ball','english.vocab.objects',1),
('english-body-head','english.vocab.body',1),('english-body-hand','english.vocab.body',1),('english-body-foot','english.vocab.body',1),('english-listen-eyes','english.vocab.body',1),('english-match-body-eyes-ears','english.vocab.body',1),
('english-family-mother','english.vocab.family',1),('english-family-father','english.vocab.family',1),('english-family-baby','english.vocab.family',1),('english-listen-sister','english.vocab.family',1),('english-match-family-siblings','english.vocab.family',1),
('english-review-word-book','english.vocab.everyday_integration',1),('english-review-listen-father','english.vocab.everyday_integration',1),('english-review-listen-fish','english.vocab.everyday_integration',1),('english-review-match-animal-object','english.vocab.everyday_integration',1),('english-review-match-body-family','english.vocab.everyday_integration',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
