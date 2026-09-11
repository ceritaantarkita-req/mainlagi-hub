-- Mainlagi Expansion Batch 13 — Science/Sains Wave B (subject total 25 -> 50)
-- Adds 25 measured assessed activities across life cycles, organism needs/food,
-- material properties, water state changes, and forces/motion.
-- Uses only existing measured matching/choice evidence contracts.
-- Additive/idempotent only; historical attempts, progress, scores, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('science.life_cycles.basic','science','Siklus hidup dasar','Mengenali tahap pertumbuhan sederhana pada hewan dan tumbuhan.','science',4,7,true,now()),
('science.organisms.needs_food.basic','science','Kebutuhan dan makanan makhluk hidup','Menghubungkan hewan dengan kebutuhan dasar dan sumber makanan familiar.','science',4,7,true,now()),
('science.materials.properties.basic','science','Sifat bahan dasar','Membedakan bahan berdasarkan sifat fisik yang mudah diamati.','science',4,7,true,now()),
('science.water.state_changes.basic','science','Perubahan wujud air dasar','Mengenali perubahan wujud air melalui contoh sehari-hari.','science',4,7,true,now()),
('science.forces.motion.basic','science','Gaya dan gerak dasar','Mengenali dorong, tarik, gravitasi, dan pengaruh permukaan pada gerak.','science',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('science.pack.life-cycles','science','science-discovery-foundations','science-life-material-motion','Life Cycles','1.0.0',4,7,'internal',true,now()),
('science.pack.organism-needs-food','science','science-discovery-foundations','science-life-material-motion','Organism Needs and Food','1.0.0',4,7,'internal',true,now()),
('science.pack.material-properties','science','science-discovery-foundations','science-life-material-motion','Material Properties','1.0.0',4,7,'internal',true,now()),
('science.pack.water-changes','science','science-discovery-foundations','science-life-material-motion','Water State Changes','1.0.0',4,7,'internal',true,now()),
('science.pack.forces-motion','science','science-discovery-foundations','science-life-material-motion','Forces and Motion','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('science-cycle-butterfly','science','science-life-material-motion','tap_choice',2,'assessed',true,false,3,'science.pack.life-cycles','science-life-cycles','tap_choice','choice_accuracy_v1',1,true,now()),
('science-cycle-frog','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.life-cycles','science-life-cycles','tap_choice','choice_accuracy_v1',1,true,now()),
('science-cycle-chick','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.life-cycles','science-life-cycles','tap_choice','choice_accuracy_v1',1,true,now()),
('science-cycle-seed-sprout','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.life-cycles','science-life-cycles','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-young-adult-b','science','science-life-material-motion','matching',2,'assessed',true,false,3,'science.pack.life-cycles','science-life-cycles','matching','matching_accuracy_v1',1,true,now()),
('science-animal-needs-food-water','science','science-life-material-motion','tap_choice',2,'assessed',true,false,3,'science.pack.organism-needs-food','science-organism-needs-food','tap_choice','choice_accuracy_v1',1,true,now()),
('science-cow-eats-grass','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.organism-needs-food','science-organism-needs-food','tap_choice','choice_accuracy_v1',1,true,now()),
('science-bird-eats-seeds','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.organism-needs-food','science-organism-needs-food','tap_choice','choice_accuracy_v1',1,true,now()),
('science-simple-food-chain','science','science-life-material-motion','tap_choice',3,'assessed',false,false,3,'science.pack.organism-needs-food','science-organism-needs-food','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-animal-food-b','science','science-life-material-motion','matching',2,'assessed',false,false,3,'science.pack.organism-needs-food','science-organism-needs-food','matching','matching_accuracy_v1',1,true,now()),
('science-material-glass-transparent','science','science-life-material-motion','tap_choice',2,'assessed',true,false,3,'science.pack.material-properties','science-material-properties','tap_choice','choice_accuracy_v1',1,true,now()),
('science-material-rubber-flexible','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.material-properties','science-material-properties','tap_choice','choice_accuracy_v1',1,true,now()),
('science-material-sponge-absorbs','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.material-properties','science-material-properties','tap_choice','choice_accuracy_v1',1,true,now()),
('science-material-metal-spoon','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.material-properties','science-material-properties','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-material-property-b','science','science-life-material-motion','matching',2,'assessed',false,false,3,'science.pack.material-properties','science-material-properties','matching','matching_accuracy_v1',1,true,now()),
('science-water-ice-melts','science','science-life-material-motion','tap_choice',2,'assessed',true,false,3,'science.pack.water-changes','science-water-changes','tap_choice','choice_accuracy_v1',1,true,now()),
('science-water-freezes','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.water-changes','science-water-changes','tap_choice','choice_accuracy_v1',1,true,now()),
('science-water-puddle-evaporates','science','science-life-material-motion','tap_choice',3,'assessed',false,false,3,'science.pack.water-changes','science-water-changes','tap_choice','choice_accuracy_v1',1,true,now()),
('science-water-cold-glass-droplets','science','science-life-material-motion','tap_choice',3,'assessed',false,false,3,'science.pack.water-changes','science-water-changes','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-water-states-b','science','science-life-material-motion','matching',2,'assessed',false,false,3,'science.pack.water-changes','science-water-changes','matching','matching_accuracy_v1',1,true,now()),
('science-force-push-door','science','science-life-material-motion','tap_choice',2,'assessed',true,false,3,'science.pack.forces-motion','science-forces-motion','tap_choice','choice_accuracy_v1',1,true,now()),
('science-force-pull-drawer','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.forces-motion','science-forces-motion','tap_choice','choice_accuracy_v1',1,true,now()),
('science-force-gravity-ball','science','science-life-material-motion','tap_choice',2,'assessed',false,false,3,'science.pack.forces-motion','science-forces-motion','tap_choice','choice_accuracy_v1',1,true,now()),
('science-force-rough-surface-slow','science','science-life-material-motion','tap_choice',3,'assessed',false,false,3,'science.pack.forces-motion','science-forces-motion','tap_choice','choice_accuracy_v1',1,true,now()),
('science-match-push-pull-b','science','science-life-material-motion','matching',2,'assessed',false,false,3,'science.pack.forces-motion','science-forces-motion','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('science-cycle-butterfly','science.life_cycles.basic',1),('science-cycle-frog','science.life_cycles.basic',1),('science-cycle-chick','science.life_cycles.basic',1),('science-cycle-seed-sprout','science.life_cycles.basic',1),('science-match-young-adult-b','science.life_cycles.basic',1),
('science-animal-needs-food-water','science.organisms.needs_food.basic',1),('science-cow-eats-grass','science.organisms.needs_food.basic',1),('science-bird-eats-seeds','science.organisms.needs_food.basic',1),('science-simple-food-chain','science.organisms.needs_food.basic',1),('science-match-animal-food-b','science.organisms.needs_food.basic',1),
('science-material-glass-transparent','science.materials.properties.basic',1),('science-material-rubber-flexible','science.materials.properties.basic',1),('science-material-sponge-absorbs','science.materials.properties.basic',1),('science-material-metal-spoon','science.materials.properties.basic',1),('science-match-material-property-b','science.materials.properties.basic',1),
('science-water-ice-melts','science.water.state_changes.basic',1),('science-water-freezes','science.water.state_changes.basic',1),('science-water-puddle-evaporates','science.water.state_changes.basic',1),('science-water-cold-glass-droplets','science.water.state_changes.basic',1),('science-match-water-states-b','science.water.state_changes.basic',1),
('science-force-push-door','science.forces.motion.basic',1),('science-force-pull-drawer','science.forces.motion.basic',1),('science-force-gravity-ball','science.forces.motion.basic',1),('science-force-rough-surface-slow','science.forces.motion.basic',1),('science-match-push-pull-b','science.forces.motion.basic',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
