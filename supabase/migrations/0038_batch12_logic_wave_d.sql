-- Mainlagi Expansion Batch 12 — Logic/Logika Wave D (subject total 75 -> 100)
-- Adds 25 measured assessed activities across composed rules, set reasoning,
-- transitive comparisons, spatial transforms, and mixed relational review.
-- Uses only existing measured matching/choice evidence contracts.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('logic.rule.composition.basic','logic','Komposisi aturan dasar','Menerapkan dua aturan sederhana secara berurutan.','reasoning',5,7,true,now()),
('logic.set.relation.basic','logic','Relasi himpunan dasar','Menentukan kategori, irisan atribut, dan pengecualian sederhana.','reasoning',5,7,true,now()),
('logic.comparison.transitive.basic','logic','Perbandingan transitif dasar','Menarik kesimpulan dari dua hubungan perbandingan bertingkat.','reasoning',5,7,true,now()),
('logic.spatial.transform.basic','logic','Transformasi spasial dasar','Menentukan arah setelah rotasi dan pencerminan sederhana.','reasoning',5,7,true,now()),
('logic.relation.mixed.review','logic','Review relasi campuran','Mengintegrasikan relasi lawan, urutan, jumlah, kategori, dan fungsi.','reasoning',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('logic.pack.composed-rules','logic','logic-thinking-foundations','logic-mixed-reasoning-challenge','Composed Rules','1.0.0',5,7,'internal',true,now()),
('logic.pack.set-reasoning','logic','logic-thinking-foundations','logic-mixed-reasoning-challenge','Set Reasoning','1.0.0',5,7,'internal',true,now()),
('logic.pack.transitive-comparison','logic','logic-thinking-foundations','logic-mixed-reasoning-challenge','Transitive Comparison','1.0.0',5,7,'internal',true,now()),
('logic.pack.spatial-transform','logic','logic-thinking-foundations','logic-mixed-reasoning-challenge','Spatial Transform','1.0.0',5,7,'internal',true,now()),
('logic.pack.relational-review','logic','logic-thinking-foundations','logic-mixed-reasoning-challenge','Mixed Relational Review','1.0.0',5,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('logic-compose-red-circle-to-star','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',true,false,3,'logic.pack.composed-rules','logic-composed-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compose-small-left-then-up','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.composed-rules','logic-composed-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compose-two-to-blue','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.composed-rules','logic-composed-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compose-triangle-turn-right','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.composed-rules','logic-composed-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compose-swap-then-grow','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.composed-rules','logic-composed-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-set-both-red-round','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',true,false,3,'logic.pack.set-reasoning','logic-set-reasoning','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-set-animal-not-bird','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.set-reasoning','logic-set-reasoning','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-set-shape-not-square','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.set-reasoning','logic-set-reasoning','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-set-only-blue-triangle','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.set-reasoning','logic-set-reasoning','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-set-outside-round-red','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.set-reasoning','logic-set-reasoning','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-transitive-height-abc','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',true,false,3,'logic.pack.transitive-comparison','logic-transitive-comparison','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-transitive-shortest-xyz','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.transitive-comparison','logic-transitive-comparison','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-transitive-most-dots','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.transitive-comparison','logic-transitive-comparison','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-transitive-lightest','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.transitive-comparison','logic-transitive-comparison','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-transitive-middle-order','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.transitive-comparison','logic-transitive-comparison','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-spatial-halfturn-up','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',true,false,3,'logic.pack.spatial-transform','logic-spatial-transform','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-spatial-quarterturn-left','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.spatial-transform','logic-spatial-transform','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-spatial-quarterturn-right-down','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.spatial-transform','logic-spatial-transform','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-spatial-two-right-turns','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.spatial-transform','logic-spatial-transform','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-spatial-mirror-left-right','logic','logic-mixed-reasoning-challenge','tap_choice',3,'assessed',false,false,3,'logic.pack.spatial-transform','logic-spatial-transform','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-review-opposites','logic','logic-mixed-reasoning-challenge','matching',3,'assessed',true,false,3,'logic.pack.relational-review','logic-relational-review','matching','matching_accuracy_v1',1,true,now()),
('logic-review-sequence-symbols','logic','logic-mixed-reasoning-challenge','matching',3,'assessed',false,false,3,'logic.pack.relational-review','logic-relational-review','matching','matching_accuracy_v1',1,true,now()),
('logic-review-count-groups','logic','logic-mixed-reasoning-challenge','matching',3,'assessed',false,false,3,'logic.pack.relational-review','logic-relational-review','matching','matching_accuracy_v1',1,true,now()),
('logic-review-category-example','logic','logic-mixed-reasoning-challenge','matching',3,'assessed',false,false,3,'logic.pack.relational-review','logic-relational-review','matching','matching_accuracy_v1',1,true,now()),
('logic-review-relation-analogy','logic','logic-mixed-reasoning-challenge','matching',3,'assessed',false,false,3,'logic.pack.relational-review','logic-relational-review','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('logic-compose-red-circle-to-star','logic.rule.composition.basic',1),('logic-compose-small-left-then-up','logic.rule.composition.basic',1),('logic-compose-two-to-blue','logic.rule.composition.basic',1),('logic-compose-triangle-turn-right','logic.rule.composition.basic',1),('logic-compose-swap-then-grow','logic.rule.composition.basic',1),
('logic-set-both-red-round','logic.set.relation.basic',1),('logic-set-animal-not-bird','logic.set.relation.basic',1),('logic-set-shape-not-square','logic.set.relation.basic',1),('logic-set-only-blue-triangle','logic.set.relation.basic',1),('logic-set-outside-round-red','logic.set.relation.basic',1),
('logic-transitive-height-abc','logic.comparison.transitive.basic',1),('logic-transitive-shortest-xyz','logic.comparison.transitive.basic',1),('logic-transitive-most-dots','logic.comparison.transitive.basic',1),('logic-transitive-lightest','logic.comparison.transitive.basic',1),('logic-transitive-middle-order','logic.comparison.transitive.basic',1),
('logic-spatial-halfturn-up','logic.spatial.transform.basic',1),('logic-spatial-quarterturn-left','logic.spatial.transform.basic',1),('logic-spatial-quarterturn-right-down','logic.spatial.transform.basic',1),('logic-spatial-two-right-turns','logic.spatial.transform.basic',1),('logic-spatial-mirror-left-right','logic.spatial.transform.basic',1),
('logic-review-opposites','logic.relation.mixed.review',1),('logic-review-sequence-symbols','logic.relation.mixed.review',1),('logic-review-count-groups','logic.relation.mixed.review',1),('logic-review-category-example','logic.relation.mixed.review',1),('logic-review-relation-analogy','logic.relation.mixed.review',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
