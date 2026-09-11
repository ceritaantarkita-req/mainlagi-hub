-- Mainlagi Expansion Batch 12 — Logic/Logika Wave A (subject total 3 -> 25)
-- Adds 22 meaningful assessed activities across relational matching, classification,
-- odd-one-out, comparison, and simple rule/sequence reasoning.
-- Uses only existing measured matching/choice evidence contracts.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('logic.relations.matching.basic','logic','Mencocokkan relasi sederhana','Mencocokkan berdasarkan kesamaan visual, jumlah setara, dan hubungan benda sederhana.','reasoning',3,7,true,now()),
('logic.classification.visual.basic','logic','Klasifikasi visual dasar','Memilih objek yang memenuhi satu aturan kategori atau ciri visual yang jelas.','reasoning',3,7,true,now()),
('logic.discrimination.odd_one_out.basic','logic','Menemukan yang berbeda','Menentukan satu pilihan yang berbeda dari kelompok berdasarkan aturan yang terlihat.','reasoning',3,7,true,now()),
('logic.comparison.visual.basic','logic','Perbandingan visual dasar','Membandingkan jumlah, kesetaraan, atau panjang melalui representasi visual sederhana.','reasoning',4,7,true,now()),
('logic.sequence.rules.basic','logic','Mengikuti aturan urutan dasar','Menentukan kelanjutan urutan dari pola pengulangan, pertambahan, atau perubahan arah sederhana.','reasoning',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('logic.pack.relations-basic','logic','logic-thinking-foundations','logic-classification-rules-basics','Basic Visual Relations','1.0.0',3,7,'internal',true,now()),
('logic.pack.classification-basic','logic','logic-thinking-foundations','logic-classification-rules-basics','Basic Classification','1.0.0',3,7,'internal',true,now()),
('logic.pack.odd-one-out-basic','logic','logic-thinking-foundations','logic-classification-rules-basics','Basic Odd One Out','1.0.0',3,7,'internal',true,now()),
('logic.pack.comparison-basic','logic','logic-thinking-foundations','logic-classification-rules-basics','Basic Comparison','1.0.0',4,7,'internal',true,now()),
('logic.pack.simple-rules-basic','logic','logic-thinking-foundations','logic-classification-rules-basics','Basic Rule Following','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('logic-match-identical-shapes','logic','logic-classification-rules-basics','matching',1,'assessed',true,false,2,'logic.pack.relations-basic','logic-relations-basic','matching','matching_accuracy_v1',1,true,now()),
('logic-match-equal-counts','logic','logic-classification-rules-basics','matching',2,'assessed',false,false,3,'logic.pack.relations-basic','logic-relations-basic','matching','matching_accuracy_v1',1,true,now()),
('logic-match-related-items','logic','logic-classification-rules-basics','matching',2,'assessed',false,false,3,'logic.pack.relations-basic','logic-relations-basic','matching','matching_accuracy_v1',1,true,now()),
('logic-classify-animal','logic','logic-classification-rules-basics','tap_choice',1,'assessed',true,false,2,'logic.pack.classification-basic','logic-classification-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-round','logic','logic-classification-rules-basics','tap_choice',1,'assessed',false,false,2,'logic.pack.classification-basic','logic-classification-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-up-arrow','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.classification-basic','logic-classification-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-two-items','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.classification-basic','logic-classification-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-classify-red','logic','logic-classification-rules-basics','tap_choice',1,'assessed',false,false,2,'logic.pack.classification-basic','logic-classification-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-odd-category-animal-vehicle','logic','logic-classification-rules-basics','tap_choice',1,'assessed',true,false,2,'logic.pack.odd-one-out-basic','logic-odd-one-out-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-odd-shape-angular','logic','logic-classification-rules-basics','tap_choice',1,'assessed',false,false,2,'logic.pack.odd-one-out-basic','logic-odd-one-out-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-odd-direction-right','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.odd-one-out-basic','logic-odd-one-out-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-odd-count-three','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.odd-one-out-basic','logic-odd-one-out-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-odd-pattern-symmetry','logic','logic-classification-rules-basics','tap_choice',3,'assessed',false,false,3,'logic.pack.odd-one-out-basic','logic-odd-one-out-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compare-more-dots','logic','logic-classification-rules-basics','tap_choice',2,'assessed',true,false,3,'logic.pack.comparison-basic','logic-comparison-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compare-fewer-stars','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.comparison-basic','logic-comparison-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compare-longest-line','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.comparison-basic','logic-comparison-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-compare-equal-three','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.comparison-basic','logic-comparison-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-alternate-shapes','logic','logic-classification-rules-basics','tap_choice',2,'assessed',true,false,3,'logic.pack.simple-rules-basic','logic-simple-rules-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-cycle-directions','logic','logic-classification-rules-basics','tap_choice',2,'assessed',false,false,3,'logic.pack.simple-rules-basic','logic-simple-rules-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-aab-repeat','logic','logic-classification-rules-basics','tap_choice',3,'assessed',false,false,3,'logic.pack.simple-rules-basic','logic-simple-rules-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-growing-dots','logic','logic-classification-rules-basics','tap_choice',3,'assessed',false,false,3,'logic.pack.simple-rules-basic','logic-simple-rules-basic','tap_choice','choice_accuracy_v1',1,true,now()),
('logic-rule-turn-clockwise','logic','logic-classification-rules-basics','tap_choice',3,'assessed',false,false,3,'logic.pack.simple-rules-basic','logic-simple-rules-basic','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('logic-match-identical-shapes','logic.relations.matching.basic',1),
('logic-match-equal-counts','logic.relations.matching.basic',1),
('logic-match-related-items','logic.relations.matching.basic',1),
('logic-classify-animal','logic.classification.visual.basic',1),
('logic-classify-round','logic.classification.visual.basic',1),
('logic-classify-up-arrow','logic.classification.visual.basic',1),
('logic-classify-two-items','logic.classification.visual.basic',1),
('logic-classify-red','logic.classification.visual.basic',1),
('logic-odd-category-animal-vehicle','logic.discrimination.odd_one_out.basic',1),
('logic-odd-shape-angular','logic.discrimination.odd_one_out.basic',1),
('logic-odd-direction-right','logic.discrimination.odd_one_out.basic',1),
('logic-odd-count-three','logic.discrimination.odd_one_out.basic',1),
('logic-odd-pattern-symmetry','logic.discrimination.odd_one_out.basic',1),
('logic-compare-more-dots','logic.comparison.visual.basic',1),
('logic-compare-fewer-stars','logic.comparison.visual.basic',1),
('logic-compare-longest-line','logic.comparison.visual.basic',1),
('logic-compare-equal-three','logic.comparison.visual.basic',1),
('logic-rule-alternate-shapes','logic.sequence.rules.basic',1),
('logic-rule-cycle-directions','logic.sequence.rules.basic',1),
('logic-rule-aab-repeat','logic.sequence.rules.basic',1),
('logic-rule-growing-dots','logic.sequence.rules.basic',1),
('logic-rule-turn-clockwise','logic.sequence.rules.basic',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
