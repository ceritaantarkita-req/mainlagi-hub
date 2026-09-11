-- Mainlagi Expansion Batch 14 — Drawing + Coloring Wave B
-- Adds 25 Drawing practice activities and 25 Coloring practice activities.
-- Creative activities remain completion-only practice and do not manufacture
-- academic/drawing/coloring mastery evidence.
-- Additive/idempotent only; historical attempts, progress, scores and certificates remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('drawing.objects.from_shapes','drawing','Objek dari bentuk','Berlatih menyusun bentuk menjadi objek familiar.','creative',3,7,true,now()),
('drawing.animals.simple','drawing','Hewan sederhana','Berlatih menyusun garis dan bentuk menjadi hewan sederhana.','creative',3,7,true,now()),
('drawing.nature.simple','drawing','Gambar alam sederhana','Berlatih menggambar bentuk alam melalui petunjuk visual.','creative',3,7,true,now()),
('drawing.people.faces','drawing','Wajah dan figur','Berlatih mengeksplorasi wajah dan figur sederhana.','creative',3,7,true,now()),
('drawing.scenes.simple','drawing','Adegan sederhana','Berlatih menggabungkan beberapa unsur menjadi satu adegan.','creative',4,7,true,now()),
('color.temperature.exploration','color','Eksplorasi hangat dan sejuk','Mencoba kesan warna hangat dan sejuk tanpa penilaian benar-salah.','creative',3,7,true,now()),
('color.patterns.exploration','color','Eksplorasi pola warna','Mencoba pengulangan warna dalam pola sederhana.','creative',3,7,true,now()),
('color.scenes.nature','color','Warna adegan alam','Mengeksplorasi warna pada beberapa bagian pemandangan.','creative',3,7,true,now()),
('color.transport.exploration','color','Warna kendaraan','Mengeksplorasi pilihan warna pada kendaraan dan komponennya.','creative',3,7,true,now()),
('color.characters.fantasy','color','Warna karakter fantasi','Menciptakan kombinasi warna bebas pada karakter imajinatif.','creative',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('drawing.pack.objects-from-shapes','drawing','drawing-creative-studio','drawing-objects-scenes','Objects from Shapes','1.0.0',3,7,'internal',true,now()),
('drawing.pack.simple-animals','drawing','drawing-creative-studio','drawing-objects-scenes','Simple Animals','1.0.0',3,7,'internal',true,now()),
('drawing.pack.plants-nature','drawing','drawing-creative-studio','drawing-objects-scenes','Plants and Nature','1.0.0',3,7,'internal',true,now()),
('drawing.pack.faces-people','drawing','drawing-creative-studio','drawing-objects-scenes','Faces and People','1.0.0',3,7,'internal',true,now()),
('drawing.pack.simple-scenes','drawing','drawing-creative-studio','drawing-objects-scenes','Simple Scenes','1.0.0',3,7,'internal',true,now()),
('color.pack.warm-cool-play','color','color-creative-play','color-patterns-scenes','Warm and Cool Play','1.0.0',3,7,'internal',true,now()),
('color.pack.repeated-patterns','color','color-creative-play','color-patterns-scenes','Repeated Patterns','1.0.0',3,7,'internal',true,now()),
('color.pack.nature-scenes','color','color-creative-play','color-patterns-scenes','Nature Scenes','1.0.0',3,7,'internal',true,now()),
('color.pack.transport-objects','color','color-creative-play','color-patterns-scenes','Transport Objects','1.0.0',3,7,'internal',true,now()),
('color.pack.fantasy-characters','color','color-creative-play','color-patterns-scenes','Fantasy Characters','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

with creative(activity_id,subject_id,stage_id,runtime,difficulty,required_for_stage,content_pack_id,lesson_id,mechanic_id) as (values
('drawing-object-cup','drawing','drawing-objects-scenes','drawing',1,true,'drawing.pack.objects-from-shapes','drawing-objects-from-shapes','drawing'),
('drawing-object-boat','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.objects-from-shapes','drawing-objects-from-shapes','drawing'),
('drawing-object-house','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.objects-from-shapes','drawing-objects-from-shapes','drawing'),
('drawing-object-car','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.objects-from-shapes','drawing-objects-from-shapes','drawing'),
('drawing-object-icecream','drawing','drawing-objects-scenes','drawing',1,false,'drawing.pack.objects-from-shapes','drawing-objects-from-shapes','drawing'),
('drawing-animal-cat','drawing','drawing-objects-scenes','drawing',2,true,'drawing.pack.simple-animals','drawing-simple-animals','drawing'),
('drawing-animal-fish','drawing','drawing-objects-scenes','drawing',1,false,'drawing.pack.simple-animals','drawing-simple-animals','drawing'),
('drawing-animal-bird','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.simple-animals','drawing-simple-animals','drawing'),
('drawing-animal-butterfly','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.simple-animals','drawing-simple-animals','drawing'),
('drawing-animal-snail','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.simple-animals','drawing-simple-animals','drawing'),
('drawing-nature-tree','drawing','drawing-objects-scenes','drawing',2,true,'drawing.pack.plants-nature','drawing-plants-nature','drawing'),
('drawing-nature-flower','drawing','drawing-objects-scenes','drawing',1,false,'drawing.pack.plants-nature','drawing-plants-nature','drawing'),
('drawing-nature-leaf','drawing','drawing-objects-scenes','drawing',1,false,'drawing.pack.plants-nature','drawing-plants-nature','drawing'),
('drawing-nature-cloud-rain','drawing','drawing-objects-scenes','drawing',1,false,'drawing.pack.plants-nature','drawing-plants-nature','drawing'),
('drawing-nature-rainbow','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.plants-nature','drawing-plants-nature','drawing'),
('drawing-face-happy','drawing','drawing-objects-scenes','drawing',1,true,'drawing.pack.faces-people','drawing-faces-people','drawing'),
('drawing-face-surprised','drawing','drawing-objects-scenes','drawing',1,false,'drawing.pack.faces-people','drawing-faces-people','drawing'),
('drawing-face-hair','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.faces-people','drawing-faces-people','drawing'),
('drawing-person-stick','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.faces-people','drawing-faces-people','drawing'),
('drawing-people-friends','drawing','drawing-objects-scenes','drawing',3,false,'drawing.pack.faces-people','drawing-faces-people','drawing'),
('drawing-scene-park','drawing','drawing-objects-scenes','drawing',2,true,'drawing.pack.simple-scenes','drawing-simple-scenes','drawing'),
('drawing-scene-beach','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.simple-scenes','drawing-simple-scenes','drawing'),
('drawing-scene-road','drawing','drawing-objects-scenes','drawing',3,false,'drawing.pack.simple-scenes','drawing-simple-scenes','drawing'),
('drawing-scene-night','drawing','drawing-objects-scenes','drawing',2,false,'drawing.pack.simple-scenes','drawing-simple-scenes','drawing'),
('drawing-scene-garden','drawing','drawing-objects-scenes','drawing',3,false,'drawing.pack.simple-scenes','drawing-simple-scenes','drawing'),
('color-warm-sun','color','color-patterns-scenes','coloring',1,true,'color.pack.warm-cool-play','color-warm-cool-play','coloring'),
('color-warm-fire','color','color-patterns-scenes','coloring',2,false,'color.pack.warm-cool-play','color-warm-cool-play','coloring'),
('color-cool-ocean','color','color-patterns-scenes','coloring',1,false,'color.pack.warm-cool-play','color-warm-cool-play','coloring'),
('color-cool-snow','color','color-patterns-scenes','coloring',2,false,'color.pack.warm-cool-play','color-warm-cool-play','coloring'),
('color-warm-cool-balloons','color','color-patterns-scenes','coloring',2,false,'color.pack.warm-cool-play','color-warm-cool-play','coloring'),
('color-pattern-stripes','color','color-patterns-scenes','coloring',1,true,'color.pack.repeated-patterns','color-repeated-patterns','coloring'),
('color-pattern-dots','color','color-patterns-scenes','coloring',1,false,'color.pack.repeated-patterns','color-repeated-patterns','coloring'),
('color-pattern-checker','color','color-patterns-scenes','coloring',2,false,'color.pack.repeated-patterns','color-repeated-patterns','coloring'),
('color-pattern-zigzag','color','color-patterns-scenes','coloring',2,false,'color.pack.repeated-patterns','color-repeated-patterns','coloring'),
('color-pattern-circles','color','color-patterns-scenes','coloring',2,false,'color.pack.repeated-patterns','color-repeated-patterns','coloring'),
('color-scene-meadow','color','color-patterns-scenes','coloring',2,true,'color.pack.nature-scenes','color-nature-scenes','coloring'),
('color-scene-rainy','color','color-patterns-scenes','coloring',2,false,'color.pack.nature-scenes','color-nature-scenes','coloring'),
('color-scene-sunset','color','color-patterns-scenes','coloring',2,false,'color.pack.nature-scenes','color-nature-scenes','coloring'),
('color-scene-forest','color','color-patterns-scenes','coloring',2,false,'color.pack.nature-scenes','color-nature-scenes','coloring'),
('color-scene-pond','color','color-patterns-scenes','coloring',3,false,'color.pack.nature-scenes','color-nature-scenes','coloring'),
('color-transport-car','color','color-patterns-scenes','coloring',1,true,'color.pack.transport-objects','color-transport-objects','coloring'),
('color-transport-bus','color','color-patterns-scenes','coloring',2,false,'color.pack.transport-objects','color-transport-objects','coloring'),
('color-transport-train','color','color-patterns-scenes','coloring',2,false,'color.pack.transport-objects','color-transport-objects','coloring'),
('color-transport-boat','color','color-patterns-scenes','coloring',2,false,'color.pack.transport-objects','color-transport-objects','coloring'),
('color-transport-rocket','color','color-patterns-scenes','coloring',3,false,'color.pack.transport-objects','color-transport-objects','coloring'),
('color-fantasy-dragon','color','color-patterns-scenes','coloring',2,true,'color.pack.fantasy-characters','color-fantasy-characters','coloring'),
('color-fantasy-unicorn','color','color-patterns-scenes','coloring',2,false,'color.pack.fantasy-characters','color-fantasy-characters','coloring'),
('color-fantasy-robot','color','color-patterns-scenes','coloring',2,false,'color.pack.fantasy-characters','color-fantasy-characters','coloring'),
('color-fantasy-monster','color','color-patterns-scenes','coloring',2,false,'color.pack.fantasy-characters','color-fantasy-characters','coloring'),
('color-fantasy-castle','color','color-patterns-scenes','coloring',3,false,'color.pack.fantasy-characters','color-fantasy-characters','coloring')
)
insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at)
select activity_id,subject_id,stage_id,runtime,difficulty,'practice',required_for_stage,false,case when difficulty=1 then 2 else 3 end,content_pack_id,lesson_id,mechanic_id,'completion_only_v1',1,true,now()
from creative
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight)
select activity_id,
  case content_pack_id
    when 'drawing.pack.objects-from-shapes' then 'drawing.objects.from_shapes'
    when 'drawing.pack.simple-animals' then 'drawing.animals.simple'
    when 'drawing.pack.plants-nature' then 'drawing.nature.simple'
    when 'drawing.pack.faces-people' then 'drawing.people.faces'
    when 'drawing.pack.simple-scenes' then 'drawing.scenes.simple'
    when 'color.pack.warm-cool-play' then 'color.temperature.exploration'
    when 'color.pack.repeated-patterns' then 'color.patterns.exploration'
    when 'color.pack.nature-scenes' then 'color.scenes.nature'
    when 'color.pack.transport-objects' then 'color.transport.exploration'
    when 'color.pack.fantasy-characters' then 'color.characters.fantasy'
  end,
  case when subject_id='drawing' then 0.4 else 0.3 end
from public.learning_activities
where content_pack_id in (
  'drawing.pack.objects-from-shapes','drawing.pack.simple-animals','drawing.pack.plants-nature','drawing.pack.faces-people','drawing.pack.simple-scenes',
  'color.pack.warm-cool-play','color.pack.repeated-patterns','color.pack.nature-scenes','color.pack.transport-objects','color.pack.fantasy-characters'
)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
