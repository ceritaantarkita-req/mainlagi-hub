-- Mainlagi Expansion Batch 14 — Drawing + Coloring Wave A
-- Drawing becomes a first-class subject. Adds 25 Drawing practice activities and
-- 23 Coloring practice activities, taking Drawing 0 -> 25 and Coloring 2 -> 25.
-- Creative activities are completion-only practice; they do not manufacture
-- handwriting/drawing/coloring accuracy or academic mastery evidence.
-- Additive/idempotent only; historical activity IDs, attempts, progress, scores,
-- certificates, and mastery identities remain unchanged.

alter table public.learning_skills drop constraint if exists learning_skills_subject_id_check;
alter table public.learning_skills add constraint learning_skills_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color','drawing'));

alter table public.learning_activities drop constraint if exists learning_activities_subject_id_check;
alter table public.learning_activities add constraint learning_activities_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color','drawing'));

alter table public.learning_attempts drop constraint if exists learning_attempts_subject_id_check;
alter table public.learning_attempts add constraint learning_attempts_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color','drawing'));

alter table public.learning_certificates drop constraint if exists learning_certificates_subject_id_check;
alter table public.learning_certificates add constraint learning_certificates_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color','drawing'));

alter table public.learning_content_packs drop constraint if exists learning_content_packs_subject_id_check;
alter table public.learning_content_packs add constraint learning_content_packs_subject_id_check
  check (subject_id in ('bahasa','english','math','iqro','letters','logic','science','color','drawing'));

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('drawing.line.control.basic','drawing','Kontrol garis dasar','Berlatih arah garis dasar dengan gerak jari di kanvas.','motor',3,7,true,now()),
('drawing.curve.control.basic','drawing','Kontrol garis lengkung','Berlatih membuat garis melengkung, bergelombang, dan berputar.','motor',3,7,true,now()),
('drawing.shape.construction.basic','drawing','Membangun bentuk dasar','Berlatih menyusun garis menjadi bentuk dasar.','creative',3,7,true,now()),
('drawing.connect_dots.basic','drawing','Menghubungkan titik','Mengikuti petunjuk visual sederhana untuk menghubungkan titik menjadi bentuk.','motor',4,7,true,now()),
('drawing.simple_composition.basic','drawing','Komposisi gambar sederhana','Menambahkan goresan sederhana untuk melengkapi sebuah gambar.','creative',3,7,true,now()),
('color.large_shapes.exploration','color','Eksplorasi warna pada bentuk','Mencoba pilihan warna pada beberapa bagian bentuk besar.','creative',3,7,true,now()),
('color.basic_objects.exploration','color','Eksplorasi warna objek','Mencoba warna pada bagian-bagian objek yang familiar.','creative',3,7,true,now()),
('color.palette.exploration.basic','color','Eksplorasi palet dasar','Mencoba kombinasi beberapa warna dalam satu aktivitas.','creative',3,7,true,now()),
('color.nature.exploration.basic','color','Eksplorasi warna alam','Mencoba warna pada bentuk-bentuk alam sederhana.','creative',3,7,true,now()),
('color.character_parts.exploration','color','Eksplorasi bagian karakter','Mencoba warna berbeda pada beberapa bagian karakter atau hewan.','creative',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('drawing.pack.lines-basic','drawing','drawing-creative-studio','drawing-lines-shapes-basics','Basic Lines','1.0.0',3,7,'internal',true,now()),
('drawing.pack.curves-basic','drawing','drawing-creative-studio','drawing-lines-shapes-basics','Basic Curves','1.0.0',3,7,'internal',true,now()),
('drawing.pack.shapes-basic','drawing','drawing-creative-studio','drawing-lines-shapes-basics','Basic Shapes','1.0.0',3,7,'internal',true,now()),
('drawing.pack.connect-dots-basic','drawing','drawing-creative-studio','drawing-lines-shapes-basics','Connect the Dots','1.0.0',4,7,'internal',true,now()),
('drawing.pack.simple-composition','drawing','drawing-creative-studio','drawing-lines-shapes-basics','Simple Composition','1.0.0',3,7,'internal',true,now()),
('color.pack.large-shapes','color','color-creative-play','color-exploration-basics','Large Shapes','1.0.0',3,7,'internal',true,now()),
('color.pack.basic-objects','color','color-creative-play','color-exploration-basics','Basic Objects','1.0.0',3,7,'internal',true,now()),
('color.pack.palette-play','color','color-creative-play','color-exploration-basics','Palette Play','1.0.0',3,7,'internal',true,now()),
('color.pack.simple-nature','color','color-creative-play','color-exploration-basics','Simple Nature','1.0.0',3,7,'internal',true,now()),
('color.pack.character-parts','color','color-creative-play','color-exploration-basics','Character Parts','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

with creative(activity_id,subject_id,stage_id,runtime,difficulty,required_for_stage,content_pack_id,lesson_id,mechanic_id) as (values
('drawing-line-vertical','drawing','drawing-lines-shapes-basics','drawing',1,true,'drawing.pack.lines-basic','drawing-lines-basic','drawing'),
('drawing-line-horizontal','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.lines-basic','drawing-lines-basic','drawing'),
('drawing-line-diagonal-up','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.lines-basic','drawing-lines-basic','drawing'),
('drawing-line-diagonal-down','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.lines-basic','drawing-lines-basic','drawing'),
('drawing-line-zigzag','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.lines-basic','drawing-lines-basic','drawing'),
('drawing-curve-wave','drawing','drawing-lines-shapes-basics','drawing',1,true,'drawing.pack.curves-basic','drawing-curves-basic','drawing'),
('drawing-curve-arch','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.curves-basic','drawing-curves-basic','drawing'),
('drawing-curve-bowl','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.curves-basic','drawing-curves-basic','drawing'),
('drawing-curve-spiral','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.curves-basic','drawing-curves-basic','drawing'),
('drawing-curve-loop','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.curves-basic','drawing-curves-basic','drawing'),
('drawing-shape-circle','drawing','drawing-lines-shapes-basics','drawing',1,true,'drawing.pack.shapes-basic','drawing-shapes-basic','drawing'),
('drawing-shape-square','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.shapes-basic','drawing-shapes-basic','drawing'),
('drawing-shape-triangle','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.shapes-basic','drawing-shapes-basic','drawing'),
('drawing-shape-rectangle','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.shapes-basic','drawing-shapes-basic','drawing'),
('drawing-shape-diamond','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.shapes-basic','drawing-shapes-basic','drawing'),
('drawing-dots-star','drawing','drawing-lines-shapes-basics','drawing',2,true,'drawing.pack.connect-dots-basic','drawing-connect-dots-basic','drawing'),
('drawing-dots-house','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.connect-dots-basic','drawing-connect-dots-basic','drawing'),
('drawing-dots-fish','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.connect-dots-basic','drawing-connect-dots-basic','drawing'),
('drawing-dots-kite','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.connect-dots-basic','drawing-connect-dots-basic','drawing'),
('drawing-dots-flower','drawing','drawing-lines-shapes-basics','drawing',3,false,'drawing.pack.connect-dots-basic','drawing-connect-dots-basic','drawing'),
('drawing-compose-sun-rays','drawing','drawing-lines-shapes-basics','drawing',1,true,'drawing.pack.simple-composition','drawing-simple-composition','drawing'),
('drawing-compose-tree-branches','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.simple-composition','drawing-simple-composition','drawing'),
('drawing-compose-face-features','drawing','drawing-lines-shapes-basics','drawing',2,false,'drawing.pack.simple-composition','drawing-simple-composition','drawing'),
('drawing-compose-rain-lines','drawing','drawing-lines-shapes-basics','drawing',1,false,'drawing.pack.simple-composition','drawing-simple-composition','drawing'),
('drawing-compose-road-path','drawing','drawing-lines-shapes-basics','drawing',3,false,'drawing.pack.simple-composition','drawing-simple-composition','drawing'),
('color-shape-circle','color','color-exploration-basics','coloring',1,true,'color.pack.large-shapes','color-large-shapes','coloring'),
('color-shape-square','color','color-exploration-basics','coloring',1,false,'color.pack.large-shapes','color-large-shapes','coloring'),
('color-shape-triangle','color','color-exploration-basics','coloring',1,false,'color.pack.large-shapes','color-large-shapes','coloring'),
('color-shape-star','color','color-exploration-basics','coloring',1,false,'color.pack.large-shapes','color-large-shapes','coloring'),
('color-shape-heart','color','color-exploration-basics','coloring',1,false,'color.pack.large-shapes','color-large-shapes','coloring'),
('color-object-ball','color','color-exploration-basics','coloring',1,true,'color.pack.basic-objects','color-basic-objects','coloring'),
('color-object-apple','color','color-exploration-basics','coloring',1,false,'color.pack.basic-objects','color-basic-objects','coloring'),
('color-object-umbrella','color','color-exploration-basics','coloring',2,false,'color.pack.basic-objects','color-basic-objects','coloring'),
('color-object-house','color','color-exploration-basics','coloring',2,false,'color.pack.basic-objects','color-basic-objects','coloring'),
('color-object-flower','color','color-exploration-basics','coloring',2,false,'color.pack.basic-objects','color-basic-objects','coloring'),
('color-palette-balloon','color','color-exploration-basics','coloring',1,true,'color.pack.palette-play','color-palette-play','coloring'),
('color-palette-fish','color','color-exploration-basics','coloring',2,false,'color.pack.palette-play','color-palette-play','coloring'),
('color-palette-car','color','color-exploration-basics','coloring',2,false,'color.pack.palette-play','color-palette-play','coloring'),
('color-palette-cup','color','color-exploration-basics','coloring',1,false,'color.pack.palette-play','color-palette-play','coloring'),
('color-palette-kite','color','color-exploration-basics','coloring',2,false,'color.pack.palette-play','color-palette-play','coloring'),
('color-nature-sun','color','color-exploration-basics','coloring',1,true,'color.pack.simple-nature','color-simple-nature','coloring'),
('color-nature-cloud','color','color-exploration-basics','coloring',1,false,'color.pack.simple-nature','color-simple-nature','coloring'),
('color-nature-tree','color','color-exploration-basics','coloring',2,false,'color.pack.simple-nature','color-simple-nature','coloring'),
('color-nature-leaf','color','color-exploration-basics','coloring',2,false,'color.pack.simple-nature','color-simple-nature','coloring'),
('color-parts-cat','color','color-exploration-basics','coloring',2,true,'color.pack.character-parts','color-character-parts','coloring'),
('color-parts-robot','color','color-exploration-basics','coloring',2,false,'color.pack.character-parts','color-character-parts','coloring'),
('color-parts-teddy','color','color-exploration-basics','coloring',2,false,'color.pack.character-parts','color-character-parts','coloring'),
('color-parts-butterfly','color','color-exploration-basics','coloring',2,false,'color.pack.character-parts','color-character-parts','coloring')
)
insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at)
select activity_id,subject_id,stage_id,runtime,difficulty,'practice',required_for_stage,false,case when difficulty=1 then 2 else 3 end,content_pack_id,lesson_id,mechanic_id,'completion_only_v1',1,true,now()
from creative
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight)
select activity_id,
  case content_pack_id
    when 'drawing.pack.lines-basic' then 'drawing.line.control.basic'
    when 'drawing.pack.curves-basic' then 'drawing.curve.control.basic'
    when 'drawing.pack.shapes-basic' then 'drawing.shape.construction.basic'
    when 'drawing.pack.connect-dots-basic' then 'drawing.connect_dots.basic'
    when 'drawing.pack.simple-composition' then 'drawing.simple_composition.basic'
    when 'color.pack.large-shapes' then 'color.large_shapes.exploration'
    when 'color.pack.basic-objects' then 'color.basic_objects.exploration'
    when 'color.pack.palette-play' then 'color.palette.exploration.basic'
    when 'color.pack.simple-nature' then 'color.nature.exploration.basic'
    when 'color.pack.character-parts' then 'color.character_parts.exploration'
  end,
  case when subject_id='drawing' then 0.4 else 0.3 end
from public.learning_activities
where content_pack_id in (
  'drawing.pack.lines-basic','drawing.pack.curves-basic','drawing.pack.shapes-basic','drawing.pack.connect-dots-basic','drawing.pack.simple-composition',
  'color.pack.large-shapes','color.pack.basic-objects','color.pack.palette-play','color.pack.simple-nature','color.pack.character-parts'
)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;

comment on constraint learning_skills_subject_id_check on public.learning_skills is
  'Canonical Mainlagi subject vocabulary after Batch 14 Wave A; Drawing is now first-class.';
comment on constraint learning_activities_subject_id_check on public.learning_activities is
  'Canonical Mainlagi activity subject vocabulary including first-class Drawing.';
comment on constraint learning_attempts_subject_id_check on public.learning_attempts is
  'Attempt storage accepts first-class Drawing; creative evidence remains completion-only practice.';
comment on constraint learning_certificates_subject_id_check on public.learning_certificates is
  'Storage vocabulary includes Drawing; this does not imply creative-practice certificate eligibility.';
comment on constraint learning_content_packs_subject_id_check on public.learning_content_packs is
  'Versioned content packs accept first-class Drawing and existing Coloring.';
