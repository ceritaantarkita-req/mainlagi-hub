-- Mainlagi Expansion Batch 13 — Science/Sains Wave A (subject total 3 -> 25)
-- Adds 22 measured assessed activities across living/non-living classification,
-- plant basics, animal features/habitats, senses/observation, and weather/day-night.
-- Uses only existing measured matching/choice evidence contracts.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('science.living.basic_classification','science','Klasifikasi hidup dasar','Membedakan makhluk hidup, tumbuhan, dan benda tak hidup pada contoh familiar.','science',3,7,true,now()),
('science.plants.parts_needs.basic','science','Bagian dan kebutuhan tumbuhan','Mengenali bagian tumbuhan serta kebutuhan dasar untuk pertumbuhan.','science',3,7,true,now()),
('science.animals.features_habitat.basic','science','Ciri dan habitat hewan','Menghubungkan hewan familiar dengan ciri tubuh dan habitat sederhananya.','science',4,7,true,now()),
('science.observation.senses.basic','science','Observasi dengan indera','Menghubungkan indera dengan jenis pengamatan sederhana.','science',3,7,true,now()),
('science.weather.daynight.basic','science','Cuaca dan siang-malam','Mengenali tanda cuaca dan pengamatan dasar siang serta malam.','science',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('science.pack.living-nonliving','science','science-discovery-foundations','science-living-observation-basics','Living and Non-Living Basics','1.0.0',3,7,'internal',true,now()),
('science.pack.plant-basics','science','science-discovery-foundations','science-living-observation-basics','Plant Parts and Needs','1.0.0',3,7,'internal',true,now()),
('science.pack.animal-basics','science','science-discovery-foundations','science-living-observation-basics','Animal Features and Habitats','1.0.0',4,7,'internal',true,now()),
('science.pack.senses-observation','science','science-discovery-foundations','science-living-observation-basics','Senses and Observation','1.0.0',3,7,'internal',true,now()),
('science.pack.weather-daynight','science','science-discovery-foundations','science-living-observation-basics','Weather and Day Night','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('science-living-dog','science','science-living-observation-basics','tap_choice',1,'assessed',true,false,2,'science.pack.living-nonliving','science-living-nonliving','tap_choice','choice_accuracy_v1',1,true,now()),
('science-nonliving-rock','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.living-nonliving','science-living-nonliving','tap_choice','choice_accuracy_v1',1,true,now()),
('science-living-tree','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.living-nonliving','science-living-nonliving','tap_choice','choice_accuracy_v1',1,true,now()),
('science-living-needs-water','science','science-living-observation-basics','tap_choice',2,'assessed',false,false,3,'science.pack.living-nonliving','science-living-nonliving','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-living-nonliving','science','science-living-observation-basics','matching',2,'assessed',true,false,3,'science.pack.living-nonliving','science-living-nonliving','matching','matching_accuracy_v1',1,true,now()),
('science-plant-needs-sunlight','science','science-living-observation-basics','tap_choice',1,'assessed',true,false,2,'science.pack.plant-basics','science-plant-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-plant-roots','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.plant-basics','science-plant-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-plant-leaves','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.plant-basics','science-plant-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-seed-grows-plant','science','science-living-observation-basics','tap_choice',2,'assessed',false,false,3,'science.pack.plant-basics','science-plant-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-plant-parts','science','science-living-observation-basics','matching',2,'assessed',false,false,3,'science.pack.plant-basics','science-plant-basics','matching','matching_accuracy_v1',1,true,now()),
('science-animal-fur-cat','science','science-living-observation-basics','tap_choice',1,'assessed',true,false,2,'science.pack.animal-basics','science-animal-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-animal-fins-fish','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.animal-basics','science-animal-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-animal-bird-wings','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.animal-basics','science-animal-basics','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-animal-homes-a','science','science-living-observation-basics','matching',2,'assessed',true,false,3,'science.pack.animal-basics','science-animal-basics','matching','matching_accuracy_v1',1,true,now()),
('science-sense-eyes-see','science','science-living-observation-basics','tap_choice',1,'assessed',true,false,2,'science.pack.senses-observation','science-senses-observation','tap_choice','choice_accuracy_v1',1,true,now()),
('science-sense-ears-hear','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.senses-observation','science-senses-observation','tap_choice','choice_accuracy_v1',1,true,now()),
('science-sense-nose-smell','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.senses-observation','science-senses-observation','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-senses-a','science','science-living-observation-basics','matching',2,'assessed',false,false,3,'science.pack.senses-observation','science-senses-observation','matching','matching_accuracy_v1',1,true,now()),
('science-weather-rain-clue','science','science-living-observation-basics','tap_choice',1,'assessed',true,false,2,'science.pack.weather-daynight','science-weather-daynight','tap_choice','choice_accuracy_v1',1,true,now()),
('science-day-sun','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.weather-daynight','science-weather-daynight','tap_choice','choice_accuracy_v1',1,true,now()),
('science-night-stars','science','science-living-observation-basics','tap_choice',1,'assessed',false,false,2,'science.pack.weather-daynight','science-weather-daynight','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-weather-signs-a','science','science-living-observation-basics','matching',2,'assessed',false,false,3,'science.pack.weather-daynight','science-weather-daynight','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('science-living-dog','science.living.basic_classification',1),('science-nonliving-rock','science.living.basic_classification',1),('science-living-tree','science.living.basic_classification',1),('science-living-needs-water','science.living.basic_classification',1),('science-match-living-nonliving','science.living.basic_classification',1),
('science-plant-needs-sunlight','science.plants.parts_needs.basic',1),('science-plant-roots','science.plants.parts_needs.basic',1),('science-plant-leaves','science.plants.parts_needs.basic',1),('science-seed-grows-plant','science.plants.parts_needs.basic',1),('science-match-plant-parts','science.plants.parts_needs.basic',1),
('science-animal-fur-cat','science.animals.features_habitat.basic',1),('science-animal-fins-fish','science.animals.features_habitat.basic',1),('science-animal-bird-wings','science.animals.features_habitat.basic',1),('science-match-animal-homes-a','science.animals.features_habitat.basic',1),
('science-sense-eyes-see','science.observation.senses.basic',1),('science-sense-ears-hear','science.observation.senses.basic',1),('science-sense-nose-smell','science.observation.senses.basic',1),('science-match-senses-a','science.observation.senses.basic',1),
('science-weather-rain-clue','science.weather.daynight.basic',1),('science-day-sun','science.weather.daynight.basic',1),('science-night-stars','science.weather.daynight.basic',1),('science-match-weather-signs-a','science.weather.daynight.basic',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
