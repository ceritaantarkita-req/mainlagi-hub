-- Mainlagi Expansion Batch 12 — Logic/Logika Wave C (subject total 50 -> 75)
-- Adds 25 meaningful assessed activities across conditional rules, multi-attribute
-- classification, analogies, relative ordering, and elimination/inference.
-- Uses only existing measured matching/choice evidence contracts.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('logic.conditional.rule.basic','logic','Aturan kondisi dasar','Mengikuti aturan kondisi dan transformasi satu langkah.','reasoning',5,7,true,now()),
('logic.classification.multi_attribute','logic','Klasifikasi multi-ciri','Memilih berdasarkan gabungan dua atribut atau pengecualian sederhana.','reasoning',5,7,true,now()),
('logic.analogy.relation.basic','logic','Analogi relasional dasar','Mencocokkan pasangan berdasarkan hubungan yang setara dan familiar.','reasoning',5,7,true,now()),
('logic.order.relative.basic','logic','Urutan relatif dasar','Menentukan sebelum, sesudah, di antara, ordinal, dan lompatan sederhana.','reasoning',5,7,true,now()),
('logic.inference.elimination.basic','logic','Inferensi eliminasi dasar','Menyisihkan pilihan dan menarik kesimpulan langsung dari informasi sederhana.','reasoning',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('logic.pack.conditional-rules','logic','logic-thinking-foundations','logic-conditional-analogy-inference','Conditional Rules','1.0.0',5,7,'internal',true,now()),
('logic.pack.multi-classification','logic','logic-thinking-foundations','logic-conditional-analogy-inference','Multi Attribute Classification','1.0.0',5,7,'internal',true,now()),
('logic.pack.analogies','logic','logic-thinking-foundations','logic-conditional-analogy-inference','Everyday Analogies','1.0.0',5,7,'internal',true,now()),
('logic.pack.relative-ordering','logic','logic-thinking-foundations','logic-conditional-analogy-inference','Relative Ordering','1.0.0',5,7,'internal',true,now()),
('logic.pack.elimination-inference','logic','logic-thinking-foundations','logic-conditional-analogy-inference','Elimination and Inference','1.0.0',5,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('logic-if-red-then-circle','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',true,false,3,'logic.pack.conditional-rules','logic-conditional-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-if-two-then-star','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.conditional-rules','logic-conditional-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-small-goes-left','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.conditional-rules','logic-conditional-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-up-means-one','logic','logic-conditional-analogy-inference','tap_choice',3,'assessed',false,false,3,'logic.pack.conditional-rules','logic-conditional-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-switch-shape','logic','logic-conditional-analogy-inference','tap_choice',3,'assessed',false,false,3,'logic.pack.conditional-rules','logic-conditional-rules','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-red-round','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',true,false,3,'logic.pack.multi-classification','logic-multi-classification','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-blue-not-round','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.multi-classification','logic-multi-classification','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-two-red-items','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.multi-classification','logic-multi-classification','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-arrow-not-left','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.multi-classification','logic-multi-classification','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-same-shape-different-color','logic','logic-conditional-analogy-inference','tap_choice',3,'assessed',false,false,3,'logic.pack.multi-classification','logic-multi-classification','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-analogy-young-adult','logic','logic-conditional-analogy-inference','matching',2,'assessed',true,false,3,'logic.pack.analogies','logic-analogies','matching','matching_accuracy_v1',1,true,now()),
('logic-analogy-container-content','logic','logic-conditional-analogy-inference','matching',2,'assessed',false,false,3,'logic.pack.analogies','logic-analogies','matching','matching_accuracy_v1',1,true,now()),
('logic-analogy-place-object','logic','logic-conditional-analogy-inference','matching',2,'assessed',false,false,3,'logic.pack.analogies','logic-analogies','matching','matching_accuracy_v1',1,true,now()),
('logic-analogy-animal-home','logic','logic-conditional-analogy-inference','matching',2,'assessed',false,false,3,'logic.pack.analogies','logic-analogies','matching','matching_accuracy_v1',1,true,now()),
('logic-analogy-action-result','logic','logic-conditional-analogy-inference','matching',3,'assessed',false,false,3,'logic.pack.analogies','logic-analogies','matching','matching_accuracy_v1',1,true,now()),
('logic-order-first-after-start','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',true,false,3,'logic.pack.relative-ordering','logic-relative-ordering','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-order-before-d','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.relative-ordering','logic-relative-ordering','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-order-between-blue-green','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.relative-ordering','logic-relative-ordering','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-order-third-symbol','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.relative-ordering','logic-relative-ordering','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-order-two-steps-after','logic','logic-conditional-analogy-inference','tap_choice',3,'assessed',false,false,3,'logic.pack.relative-ordering','logic-relative-ordering','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-infer-not-red','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',true,false,3,'logic.pack.elimination-inference','logic-elimination-inference','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-infer-only-triangle','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.elimination-inference','logic-elimination-inference','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-infer-not-largest','logic','logic-conditional-analogy-inference','tap_choice',2,'assessed',false,false,3,'logic.pack.elimination-inference','logic-elimination-inference','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-infer-common-feature','logic','logic-conditional-analogy-inference','tap_choice',3,'assessed',false,false,3,'logic.pack.elimination-inference','logic-elimination-inference','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-infer-missing-member','logic','logic-conditional-analogy-inference','tap_choice',3,'assessed',false,false,3,'logic.pack.elimination-inference','logic-elimination-inference','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('logic-if-red-then-circle','logic.conditional.rule.basic',1),('logic-if-two-then-star','logic.conditional.rule.basic',1),('logic-rule-small-goes-left','logic.conditional.rule.basic',1),('logic-rule-up-means-one','logic.conditional.rule.basic',1),('logic-rule-switch-shape','logic.conditional.rule.basic',1),
('logic-classify-red-round','logic.classification.multi_attribute',1),('logic-classify-blue-not-round','logic.classification.multi_attribute',1),('logic-classify-two-red-items','logic.classification.multi_attribute',1),('logic-classify-arrow-not-left','logic.classification.multi_attribute',1),('logic-classify-same-shape-different-color','logic.classification.multi_attribute',1),
('logic-analogy-young-adult','logic.analogy.relation.basic',1),('logic-analogy-container-content','logic.analogy.relation.basic',1),('logic-analogy-place-object','logic.analogy.relation.basic',1),('logic-analogy-animal-home','logic.analogy.relation.basic',1),('logic-analogy-action-result','logic.analogy.relation.basic',1),
('logic-order-first-after-start','logic.order.relative.basic',1),('logic-order-before-d','logic.order.relative.basic',1),('logic-order-between-blue-green','logic.order.relative.basic',1),('logic-order-third-symbol','logic.order.relative.basic',1),('logic-order-two-steps-after','logic.order.relative.basic',1),
('logic-infer-not-red','logic.inference.elimination.basic',1),('logic-infer-only-triangle','logic.inference.elimination.basic',1),('logic-infer-not-largest','logic.inference.elimination.basic',1),('logic-infer-common-feature','logic.inference.elimination.basic',1),('logic-infer-missing-member','logic.inference.elimination.basic',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
