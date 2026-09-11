-- Mainlagi Expansion Batch 14 — Drawing + Coloring Wave D
-- Adds 25 Drawing + 25 Coloring completion-only creative practice activities.
-- Final Batch 14 wave: Drawing 100 and Coloring 100.
-- Additive/idempotent only; no creative activity qualifies as measured mastery evidence.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('drawing.composition.focus','drawing','Komposisi dan fokus','Mengeksplorasi ukuran, posisi, bingkai, dan jalur untuk fokus visual.','creative',4,7,true,now()),
('drawing.character.design','drawing','Desain karakter','Mengeksplorasi atribut dan identitas visual karakter.','creative',3,7,true,now()),
('drawing.world.mapping','drawing','Peta dan dunia','Menyusun tempat dan jalur menjadi peta atau dunia imajinatif.','creative',4,7,true,now()),
('drawing.visual.design','drawing','Desain visual','Mengeksplorasi simbol dan susunan visual untuk desain sederhana.','creative',4,7,true,now()),
('drawing.capstone.exploration','drawing','Eksplorasi gambar akhir','Menggabungkan pengalaman gambar dalam tantangan kreatif terbuka.','creative',4,7,true,now()),
('color.palette.limited','color','Palet terbatas','Mengeksplorasi variasi penggunaan sejumlah kecil warna.','creative',3,7,true,now()),
('color.scene.time_season','color','Waktu dan musim','Mengeksplorasi suasana warna berdasarkan waktu dan kondisi lingkungan.','creative',3,7,true,now()),
('color.character.palette','color','Palet karakter','Menciptakan identitas visual karakter melalui pilihan warna personal.','creative',4,7,true,now()),
('color.scene.storytelling','color','Warna dalam cerita','Menggunakan warna untuk mendukung suasana adegan cerita.','creative',4,7,true,now()),
('color.capstone.exploration','color','Eksplorasi warna akhir','Menggabungkan pengalaman warna dalam tantangan kreatif terbuka.','creative',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('drawing.pack.composition-focus','drawing','drawing-creative-studio','drawing-composition-design-capstone','Composition and Focus','1.0.0',3,7,'internal',true,now()),
('drawing.pack.character-design','drawing','drawing-creative-studio','drawing-composition-design-capstone','Character Design','1.0.0',3,7,'internal',true,now()),
('drawing.pack.world-maps','drawing','drawing-creative-studio','drawing-composition-design-capstone','World Maps','1.0.0',3,7,'internal',true,now()),
('drawing.pack.visual-design','drawing','drawing-creative-studio','drawing-composition-design-capstone','Visual Design','1.0.0',3,7,'internal',true,now()),
('drawing.pack.capstone-challenges','drawing','drawing-creative-studio','drawing-composition-design-capstone','Drawing Capstone Challenges','1.0.0',3,7,'internal',true,now()),
('color.pack.limited-palettes','color','color-creative-play','color-palette-scene-capstone','Limited Palettes','1.0.0',3,7,'internal',true,now()),
('color.pack.time-season','color','color-creative-play','color-palette-scene-capstone','Time and Season','1.0.0',3,7,'internal',true,now()),
('color.pack.character-palettes','color','color-creative-play','color-palette-scene-capstone','Character Palettes','1.0.0',3,7,'internal',true,now()),
('color.pack.scene-storytelling','color','color-creative-play','color-palette-scene-capstone','Scene Storytelling','1.0.0',3,7,'internal',true,now()),
('color.pack.capstone-palettes','color','color-creative-play','color-palette-scene-capstone','Color Capstone Challenges','1.0.0',3,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

with creative(activity_id,subject_id,content_pack_id,lesson_id,difficulty,required_for_stage) as (values
('drawing-focus-big-small','drawing','drawing.pack.composition-focus','drawing-composition-focus',2,true),
('drawing-focus-center-side','drawing','drawing.pack.composition-focus','drawing-composition-focus',2,false),
('drawing-focus-frame','drawing','drawing.pack.composition-focus','drawing-composition-focus',2,false),
('drawing-focus-path','drawing','drawing.pack.composition-focus','drawing-composition-focus',3,false),
('drawing-focus-crowd','drawing','drawing.pack.composition-focus','drawing-composition-focus',3,false),
('drawing-character-hat','drawing','drawing.pack.character-design','drawing-character-design',1,true),
('drawing-character-job','drawing','drawing.pack.character-design','drawing-character-design',2,false),
('drawing-character-emotion','drawing','drawing.pack.character-design','drawing-character-design',2,false),
('drawing-character-pet','drawing','drawing.pack.character-design','drawing-character-design',2,false),
('drawing-character-costume','drawing','drawing.pack.character-design','drawing-character-design',3,false),
('drawing-map-bedroom','drawing','drawing.pack.world-maps','drawing-world-maps',2,true),
('drawing-map-playground','drawing','drawing.pack.world-maps','drawing-world-maps',2,false),
('drawing-map-treasure','drawing','drawing.pack.world-maps','drawing-world-maps',3,false),
('drawing-map-island','drawing','drawing.pack.world-maps','drawing-world-maps',3,false),
('drawing-map-space-base','drawing','drawing.pack.world-maps','drawing-world-maps',3,false),
('drawing-design-badge','drawing','drawing.pack.visual-design','drawing-visual-design',2,true),
('drawing-design-flag','drawing','drawing.pack.visual-design','drawing-visual-design',2,false),
('drawing-design-book-cover','drawing','drawing.pack.visual-design','drawing-visual-design',3,false),
('drawing-design-sign','drawing','drawing.pack.visual-design','drawing-visual-design',2,false),
('drawing-design-poster','drawing','drawing.pack.visual-design','drawing-visual-design',3,false),
('drawing-capstone-favorite-place','drawing','drawing.pack.capstone-challenges','drawing-capstone-challenges',3,true),
('drawing-capstone-new-creature','drawing','drawing.pack.capstone-challenges','drawing-capstone-challenges',3,false),
('drawing-capstone-machine','drawing','drawing.pack.capstone-challenges','drawing-capstone-challenges',3,false),
('drawing-capstone-mini-story','drawing','drawing.pack.capstone-challenges','drawing-capstone-challenges',3,false),
('drawing-capstone-free-studio','drawing','drawing.pack.capstone-challenges','drawing-capstone-challenges',3,false),
('color-limited-two-flower','color','color.pack.limited-palettes','color-limited-palettes',1,true),
('color-limited-three-fish','color','color.pack.limited-palettes','color-limited-palettes',2,false),
('color-limited-two-house','color','color.pack.limited-palettes','color-limited-palettes',2,false),
('color-limited-three-robot','color','color.pack.limited-palettes','color-limited-palettes',2,false),
('color-limited-three-pattern','color','color.pack.limited-palettes','color-limited-palettes',3,false),
('color-time-morning','color','color.pack.time-season','color-time-season',2,true),
('color-time-noon','color','color.pack.time-season','color-time-season',2,false),
('color-time-evening','color','color.pack.time-season','color-time-season',2,false),
('color-time-night','color','color.pack.time-season','color-time-season',2,false),
('color-season-rainy','color','color.pack.time-season','color-time-season',3,false),
('color-character-hero','color','color.pack.character-palettes','color-character-palettes',2,true),
('color-character-explorer','color','color.pack.character-palettes','color-character-palettes',2,false),
('color-character-chef','color','color.pack.character-palettes','color-character-palettes',2,false),
('color-character-space','color','color.pack.character-palettes','color-character-palettes',3,false),
('color-character-creature','color','color.pack.character-palettes','color-character-palettes',3,false),
('color-scene-welcome','color','color.pack.scene-storytelling','color-scene-storytelling',2,true),
('color-scene-search','color','color.pack.scene-storytelling','color-scene-storytelling',2,false),
('color-scene-celebrate','color','color.pack.scene-storytelling','color-scene-storytelling',2,false),
('color-scene-journey','color','color.pack.scene-storytelling','color-scene-storytelling',3,false),
('color-scene-discovery','color','color.pack.scene-storytelling','color-scene-storytelling',3,false),
('color-capstone-dream-room','color','color.pack.capstone-palettes','color-capstone-palettes',3,true),
('color-capstone-fantasy-garden','color','color.pack.capstone-palettes','color-capstone-palettes',3,false),
('color-capstone-future-city','color','color.pack.capstone-palettes','color-capstone-palettes',3,false),
('color-capstone-story-world','color','color.pack.capstone-palettes','color-capstone-palettes',3,false),
('color-capstone-free-palette','color','color.pack.capstone-palettes','color-capstone-palettes',3,false)
)
insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at)
select activity_id,subject_id,
  case when subject_id='drawing' then 'drawing-composition-design-capstone' else 'color-palette-scene-capstone' end,
  case when subject_id='drawing' then 'drawing' else 'coloring' end,
  difficulty,'practice',required_for_stage,false,case when difficulty=1 then 2 else 3 end,
  content_pack_id,lesson_id,case when subject_id='drawing' then 'drawing' else 'coloring' end,'completion_only_v1',1,true,now()
from creative
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight)
select activity_id,
  case content_pack_id
    when 'drawing.pack.composition-focus' then 'drawing.composition.focus'
    when 'drawing.pack.character-design' then 'drawing.character.design'
    when 'drawing.pack.world-maps' then 'drawing.world.mapping'
    when 'drawing.pack.visual-design' then 'drawing.visual.design'
    when 'drawing.pack.capstone-challenges' then 'drawing.capstone.exploration'
    when 'color.pack.limited-palettes' then 'color.palette.limited'
    when 'color.pack.time-season' then 'color.scene.time_season'
    when 'color.pack.character-palettes' then 'color.character.palette'
    when 'color.pack.scene-storytelling' then 'color.scene.storytelling'
    when 'color.pack.capstone-palettes' then 'color.capstone.exploration'
  end,
  case when subject_id='drawing' then 0.4 else 0.3 end
from public.learning_activities
where stage_id in ('drawing-composition-design-capstone','color-palette-scene-capstone')
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
