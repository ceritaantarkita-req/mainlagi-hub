-- Mainlagi Expansion Batch 14 — Drawing + Coloring Wave C
-- Adds 25 Drawing + 25 Coloring completion-only creative practice activities.
-- Additive/idempotent only; no creative activity qualifies as measured mastery evidence.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('drawing.space.layers','drawing','Ruang dan lapisan','Mengeksplorasi posisi, ukuran, dan tumpang tindih dalam gambar.','creative',4,7,true,now()),
('drawing.texture.marks','drawing','Tekstur dan goresan','Memakai variasi goresan untuk kesan permukaan.','creative',3,7,true,now()),
('drawing.symmetry.exploration','drawing','Keseimbangan dua sisi','Mengeksplorasi bentuk dua sisi tanpa klaim akurasi simetri.','creative',4,7,true,now()),
('drawing.story.sequence','drawing','Urutan cerita visual','Menyampaikan perubahan sederhana melalui dua momen gambar.','creative',4,7,true,now()),
('drawing.imagination.invention','drawing','Sketsa imajinasi','Menciptakan objek baru dengan menggabungkan bentuk dan ide.','creative',4,7,true,now()),
('color.palette.neighbor','color','Palet berdekatan','Mengeksplorasi hubungan warna yang terasa selaras secara personal.','creative',3,7,true,now()),
('color.palette.contrast','color','Eksplorasi kontras','Mengeksplorasi perbedaan warna kuat tanpa jawaban tunggal.','creative',4,7,true,now()),
('color.palette.mood','color','Palet suasana','Mengeksplorasi asosiasi personal antara warna dan suasana.','creative',3,7,true,now()),
('color.material.exploration','color','Warna material','Mengeksplorasi warna pada berbagai pola permukaan imajinatif.','creative',4,7,true,now()),
('color.story.scenes','color','Warna adegan cerita','Menggunakan warna untuk membangun suasana cerita sederhana.','creative',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('drawing.pack.space-layers','drawing','drawing-creative-studio','drawing-space-story-imagination','Space and Layers','1.0.0',3,7,'internal',true,now()),
('drawing.pack.texture-marks','drawing','drawing-creative-studio','drawing-space-story-imagination','Texture Marks','1.0.0',3,7,'internal',true,now()),
('drawing.pack.symmetry-play','drawing','drawing-creative-studio','drawing-space-story-imagination','Two-side Balance Play','1.0.0',3,7,'internal',true,now()),
('drawing.pack.story-sequence','drawing','drawing-creative-studio','drawing-space-story-imagination','Story Sequence','1.0.0',3,7,'internal',true,now()),
('drawing.pack.invention-sketches','drawing','drawing-creative-studio','drawing-space-story-imagination','Invention Sketches','1.0.0',3,7,'internal',true,now()),
('color.pack.neighbor-palettes','color','color-creative-play','color-mood-material-story','Neighbor Palettes','1.0.0',3,7,'internal',true,now()),
('color.pack.contrast-play','color','color-creative-play','color-mood-material-story','Contrast Play','1.0.0',3,7,'internal',true,now()),
('color.pack.mood-palettes','color','color-creative-play','color-mood-material-story','Mood Palettes','1.0.0',3,7,'internal',true,now()),
('color.pack.material-surfaces','color','color-creative-play','color-mood-material-story','Material Surfaces','1.0.0',3,7,'internal',true,now()),
('color.pack.story-scenes','color','color-creative-play','color-mood-material-story','Story Scenes','1.0.0',3,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

with creative(activity_id,subject_id,content_pack_id,lesson_id,difficulty,required_for_stage) as (values
('drawing-space-near-far','drawing','drawing.pack.space-layers','drawing-space-layers',2,true),
('drawing-space-overlap','drawing','drawing.pack.space-layers','drawing-space-layers',2,false),
('drawing-space-horizon','drawing','drawing.pack.space-layers','drawing-space-layers',2,false),
('drawing-space-path-depth','drawing','drawing.pack.space-layers','drawing-space-layers',3,false),
('drawing-space-window-view','drawing','drawing.pack.space-layers','drawing-space-layers',2,false),
('drawing-texture-fur','drawing','drawing.pack.texture-marks','drawing-texture-marks',1,true),
('drawing-texture-scales','drawing','drawing.pack.texture-marks','drawing-texture-marks',2,false),
('drawing-texture-brick','drawing','drawing.pack.texture-marks','drawing-texture-marks',2,false),
('drawing-texture-grass','drawing','drawing.pack.texture-marks','drawing-texture-marks',1,false),
('drawing-texture-water','drawing','drawing.pack.texture-marks','drawing-texture-marks',2,false),
('drawing-symmetry-butterfly','drawing','drawing.pack.symmetry-play','drawing-symmetry-play',2,true),
('drawing-symmetry-mask','drawing','drawing.pack.symmetry-play','drawing-symmetry-play',2,false),
('drawing-symmetry-flower','drawing','drawing.pack.symmetry-play','drawing-symmetry-play',2,false),
('drawing-symmetry-robot','drawing','drawing.pack.symmetry-play','drawing-symmetry-play',3,false),
('drawing-symmetry-kite','drawing','drawing.pack.symmetry-play','drawing-symmetry-play',2,false),
('drawing-story-seed-sprout','drawing','drawing.pack.story-sequence','drawing-story-sequence',2,true),
('drawing-story-rain-sun','drawing','drawing.pack.story-sequence','drawing-story-sequence',2,false),
('drawing-story-ball-roll','drawing','drawing.pack.story-sequence','drawing-story-sequence',2,false),
('drawing-story-build-house','drawing','drawing.pack.story-sequence','drawing-story-sequence',3,false),
('drawing-story-friend-wave','drawing','drawing.pack.story-sequence','drawing-story-sequence',3,false),
('drawing-invent-flying-car','drawing','drawing.pack.invention-sketches','drawing-invention-sketches',3,true),
('drawing-invent-helper-robot','drawing','drawing.pack.invention-sketches','drawing-invention-sketches',3,false),
('drawing-invent-fantasy-house','drawing','drawing.pack.invention-sketches','drawing-invention-sketches',2,false),
('drawing-invent-animal-mix','drawing','drawing.pack.invention-sketches','drawing-invention-sketches',3,false),
('drawing-invent-playground','drawing','drawing.pack.invention-sketches','drawing-invention-sketches',3,false),
('color-neighbor-leaves','color','color.pack.neighbor-palettes','color-neighbor-palettes',2,true),
('color-neighbor-fish','color','color.pack.neighbor-palettes','color-neighbor-palettes',2,false),
('color-neighbor-flowers','color','color.pack.neighbor-palettes','color-neighbor-palettes',2,false),
('color-neighbor-sky','color','color.pack.neighbor-palettes','color-neighbor-palettes',2,false),
('color-neighbor-shell','color','color.pack.neighbor-palettes','color-neighbor-palettes',2,false),
('color-contrast-kite','color','color.pack.contrast-play','color-contrast-play',2,true),
('color-contrast-bird','color','color.pack.contrast-play','color-contrast-play',2,false),
('color-contrast-sign','color','color.pack.contrast-play','color-contrast-play',2,false),
('color-contrast-umbrella','color','color.pack.contrast-play','color-contrast-play',2,false),
('color-contrast-space','color','color.pack.contrast-play','color-contrast-play',3,false),
('color-mood-cheerful','color','color.pack.mood-palettes','color-mood-palettes',1,true),
('color-mood-calm','color','color.pack.mood-palettes','color-mood-palettes',2,false),
('color-mood-cozy','color','color.pack.mood-palettes','color-mood-palettes',2,false),
('color-mood-adventure','color','color.pack.mood-palettes','color-mood-palettes',3,false),
('color-mood-dreamy','color','color.pack.mood-palettes','color-mood-palettes',3,false),
('color-material-wood','color','color.pack.material-surfaces','color-material-surfaces',2,true),
('color-material-metal','color','color.pack.material-surfaces','color-material-surfaces',2,false),
('color-material-fabric','color','color.pack.material-surfaces','color-material-surfaces',2,false),
('color-material-stone','color','color.pack.material-surfaces','color-material-surfaces',2,false),
('color-material-glass','color','color.pack.material-surfaces','color-material-surfaces',3,false),
('color-story-morning','color','color.pack.story-scenes','color-story-scenes',2,true),
('color-story-rain-trip','color','color.pack.story-scenes','color-story-scenes',2,false),
('color-story-picnic','color','color.pack.story-scenes','color-story-scenes',2,false),
('color-story-night-camp','color','color.pack.story-scenes','color-story-scenes',3,false),
('color-story-party','color','color.pack.story-scenes','color-story-scenes',3,false)
)
insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at)
select activity_id,subject_id,
  case when subject_id='drawing' then 'drawing-space-story-imagination' else 'color-mood-material-story' end,
  case when subject_id='drawing' then 'drawing' else 'coloring' end,
  difficulty,'practice',required_for_stage,false,case when difficulty=1 then 2 else 3 end,
  content_pack_id,lesson_id,case when subject_id='drawing' then 'drawing' else 'coloring' end,'completion_only_v1',1,true,now()
from creative
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight)
select activity_id,
  case content_pack_id
    when 'drawing.pack.space-layers' then 'drawing.space.layers'
    when 'drawing.pack.texture-marks' then 'drawing.texture.marks'
    when 'drawing.pack.symmetry-play' then 'drawing.symmetry.exploration'
    when 'drawing.pack.story-sequence' then 'drawing.story.sequence'
    when 'drawing.pack.invention-sketches' then 'drawing.imagination.invention'
    when 'color.pack.neighbor-palettes' then 'color.palette.neighbor'
    when 'color.pack.contrast-play' then 'color.palette.contrast'
    when 'color.pack.mood-palettes' then 'color.palette.mood'
    when 'color.pack.material-surfaces' then 'color.material.exploration'
    when 'color.pack.story-scenes' then 'color.story.scenes'
  end,
  case when subject_id='drawing' then 0.4 else 0.3 end
from public.learning_activities
where stage_id in ('drawing-space-story-imagination','color-mood-material-story')
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
