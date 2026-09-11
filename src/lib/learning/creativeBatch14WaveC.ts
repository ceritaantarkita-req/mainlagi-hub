import type { CreativeBatch14ActivitySeed, CreativeBatch14WaveDefinition } from "./creativeBatch14Authoring";

const DRAWING_STAGE = "drawing-space-story-imagination";
const COLOR_STAGE = "color-mood-material-story";

type Row = [id:string, title:string, emoji:string, difficulty:1|2|3];

function drawPack(packId:string, lessonId:string, skillId:string, rows:Row[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,emoji,difficulty],index)=>({
    kind:"drawing",id,subjectId:"drawing",stageId:DRAWING_STAGE,packId,lessonId,title,
    description:`Latihan menggambar kreatif: ${title}.`,emoji,ageMin:3,ageMax:7,difficulty,
    requiredForStage:index===0,skillId,creativePrompt:`Eksplorasi ${title.toLowerCase()} dengan cara versimu sendiri.`,
    drawingGuide:`Panduan visual sederhana untuk ${title.toLowerCase()}.`
  }));
}
function colorPack(packId:string, lessonId:string, skillId:string, rows:Row[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,emoji,difficulty],index)=>({
    kind:"coloring",id,subjectId:"color",stageId:COLOR_STAGE,packId,lessonId,title,
    description:`Eksplorasi warna kreatif: ${title}.`,emoji,ageMin:3,ageMax:7,difficulty,
    requiredForStage:index===0,skillId,creativePrompt:`Pilih kombinasi warna versimu untuk ${title.toLowerCase()}; tidak ada satu jawaban benar.`,
    coloringCharacter:id.replace(/^color-/,""),coloringRegions:[`${id}-utama`,`${id}-detail`,`${id}-latar`]
  }));
}

const drawingActivities: CreativeBatch14ActivitySeed[] = [
  ...drawPack("drawing.pack.space-layers","drawing-space-layers","drawing.space.layers",[
    ["drawing-space-near-far","Dekat dan Jauh","🏔️",2],["drawing-space-overlap","Bentuk Bertumpuk","◒",2],
    ["drawing-space-horizon","Garis Horizon","🌄",2],["drawing-space-path-depth","Jalan Mengecil","🛤️",3],
    ["drawing-space-window-view","Pemandangan Jendela","🪟",2]
  ]),
  ...drawPack("drawing.pack.texture-marks","drawing-texture-marks","drawing.texture.marks",[
    ["drawing-texture-fur","Tekstur Bulu","🐻",1],["drawing-texture-scales","Tekstur Sisik","🐟",2],
    ["drawing-texture-brick","Tekstur Bata","🧱",2],["drawing-texture-grass","Tekstur Rumput","🌱",1],
    ["drawing-texture-water","Tekstur Air","💧",2]
  ]),
  ...drawPack("drawing.pack.symmetry-play","drawing-symmetry-play","drawing.symmetry.exploration",[
    ["drawing-symmetry-butterfly","Sayap Kiri-Kanan","🦋",2],["drawing-symmetry-mask","Topeng Dua Sisi","🎭",2],
    ["drawing-symmetry-flower","Bunga Radial","🌸",2],["drawing-symmetry-robot","Robot Seimbang","🤖",3],
    ["drawing-symmetry-kite","Layang-layang Dua Sisi","🪁",2]
  ]),
  ...drawPack("drawing.pack.story-sequence","drawing-story-sequence","drawing.story.sequence",[
    ["drawing-story-seed-sprout","Biji Menjadi Tunas","🌱",2],["drawing-story-rain-sun","Hujan Lalu Cerah","🌦️",2],
    ["drawing-story-ball-roll","Bola Bergerak","⚽",2],["drawing-story-build-house","Rumah Bertambah","🏠",3],
    ["drawing-story-friend-wave","Teman Menyapa","👋",3]
  ]),
  ...drawPack("drawing.pack.invention-sketches","drawing-invention-sketches","drawing.imagination.invention",[
    ["drawing-invent-flying-car","Mobil Terbang","🚗",3],["drawing-invent-helper-robot","Robot Penolong","🤖",3],
    ["drawing-invent-fantasy-house","Rumah Imajinasi","🏡",2],["drawing-invent-animal-mix","Hewan Campuran","🦄",3],
    ["drawing-invent-playground","Taman Bermain Baru","🛝",3]
  ])
];

const colorActivities: CreativeBatch14ActivitySeed[] = [
  ...colorPack("color.pack.neighbor-palettes","color-neighbor-palettes","color.palette.neighbor",[
    ["color-neighbor-leaves","Daun Satu Keluarga Warna","🍃",2],["color-neighbor-fish","Ikan Palet Dekat","🐠",2],
    ["color-neighbor-flowers","Bunga Palet Lembut","💐",2],["color-neighbor-sky","Langit Berlapis","🌤️",2],
    ["color-neighbor-shell","Kerang Palet Dekat","🐚",2]
  ]),
  ...colorPack("color.pack.contrast-play","color-contrast-play","color.palette.contrast",[
    ["color-contrast-kite","Layang-layang Kontras","🪁",2],["color-contrast-bird","Burung Kontras","🐦",2],
    ["color-contrast-sign","Papan Bentuk","🔶",2],["color-contrast-umbrella","Payung Kontras","☂️",2],
    ["color-contrast-space","Planet dan Ruang","🪐",3]
  ]),
  ...colorPack("color.pack.mood-palettes","color-mood-palettes","color.palette.mood",[
    ["color-mood-cheerful","Suasana Ceria","😊",1],["color-mood-calm","Suasana Tenang","😌",2],
    ["color-mood-cozy","Suasana Nyaman","🛋️",2],["color-mood-adventure","Suasana Petualangan","🧭",3],
    ["color-mood-dreamy","Suasana Mimpi","💭",3]
  ]),
  ...colorPack("color.pack.material-surfaces","color-material-surfaces","color.material.exploration",[
    ["color-material-wood","Benda Kayu","🪵",2],["color-material-metal","Benda Metal Imajinatif","⚙️",2],
    ["color-material-fabric","Kain Berpola","🧵",2],["color-material-stone","Batu Warna-warni","🪨",2],
    ["color-material-glass","Kaca Imajinasi","🔷",3]
  ]),
  ...colorPack("color.pack.story-scenes","color-story-scenes","color.story.scenes",[
    ["color-story-morning","Cerita Pagi","🌅",2],["color-story-rain-trip","Perjalanan Hujan","🌧️",2],
    ["color-story-picnic","Piknik","🧺",2],["color-story-night-camp","Kemah Malam","⛺",3],
    ["color-story-party","Pesta Kecil","🎉",3]
  ])
];

export const CREATIVE_BATCH14_WAVE_C: CreativeBatch14WaveDefinition = {
  wave:"C",
  stages:[
    {id:DRAWING_STAGE,subjectId:"drawing",title:"Ruang, Cerita & Imajinasi",subtitle:"Eksplorasi ruang, tekstur, keseimbangan visual, cerita, dan ide ciptaan sendiri.",emoji:"🖍️"},
    {id:COLOR_STAGE,subjectId:"color",title:"Suasana, Material & Cerita",subtitle:"Eksplorasi hubungan warna, kontras, suasana, material, dan adegan cerita tanpa jawaban tunggal.",emoji:"🎨"}
  ],
  lessons:[
    {id:"drawing-space-layers",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Ruang & Lapisan",objective:"Mengeksplorasi posisi, ukuran, dan tumpang tindih untuk membangun ruang visual.",ageMin:4,ageMax:7},
    {id:"drawing-texture-marks",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Tekstur & Goresan",objective:"Mencoba variasi goresan untuk menciptakan kesan permukaan.",ageMin:3,ageMax:7},
    {id:"drawing-symmetry-play",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Keseimbangan Dua Sisi",objective:"Mengeksplorasi bentuk dua sisi tanpa menilai ketepatan simetri.",ageMin:4,ageMax:7},
    {id:"drawing-story-sequence",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Urutan Cerita",objective:"Menggambar dua momen sederhana untuk menyampaikan perubahan atau urutan.",ageMin:4,ageMax:7},
    {id:"drawing-invention-sketches",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Sketsa Penemuan",objective:"Menggabungkan bentuk dan ide untuk menciptakan objek imajinatif.",ageMin:4,ageMax:7},
    {id:"color-neighbor-palettes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Palet Berdekatan",objective:"Mengeksplorasi warna yang terasa saling berhubungan menurut anak.",ageMin:3,ageMax:7},
    {id:"color-contrast-play",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Permainan Kontras",objective:"Mengeksplorasi perbedaan warna tanpa menilai pilihan sebagai benar atau salah.",ageMin:4,ageMax:7},
    {id:"color-mood-palettes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Palet Suasana",objective:"Menghubungkan pilihan warna dengan suasana personal secara terbuka.",ageMin:3,ageMax:7},
    {id:"color-material-surfaces",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Permukaan & Material",objective:"Mengeksplorasi warna pada pola permukaan dan material imajinatif.",ageMin:4,ageMax:7},
    {id:"color-story-scenes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Warna dalam Cerita",objective:"Menggunakan warna untuk memberi suasana pada adegan cerita sederhana.",ageMin:4,ageMax:7}
  ],
  packs:[
    ["drawing.pack.space-layers","drawing","drawing-creative-studio",DRAWING_STAGE,"Space and Layers","drawing-space-layers"],
    ["drawing.pack.texture-marks","drawing","drawing-creative-studio",DRAWING_STAGE,"Texture Marks","drawing-texture-marks"],
    ["drawing.pack.symmetry-play","drawing","drawing-creative-studio",DRAWING_STAGE,"Two-side Balance Play","drawing-symmetry-play"],
    ["drawing.pack.story-sequence","drawing","drawing-creative-studio",DRAWING_STAGE,"Story Sequence","drawing-story-sequence"],
    ["drawing.pack.invention-sketches","drawing","drawing-creative-studio",DRAWING_STAGE,"Invention Sketches","drawing-invention-sketches"],
    ["color.pack.neighbor-palettes","color","color-creative-play",COLOR_STAGE,"Neighbor Palettes","color-neighbor-palettes"],
    ["color.pack.contrast-play","color","color-creative-play",COLOR_STAGE,"Contrast Play","color-contrast-play"],
    ["color.pack.mood-palettes","color","color-creative-play",COLOR_STAGE,"Mood Palettes","color-mood-palettes"],
    ["color.pack.material-surfaces","color","color-creative-play",COLOR_STAGE,"Material Surfaces","color-material-surfaces"],
    ["color.pack.story-scenes","color","color-creative-play",COLOR_STAGE,"Story Scenes","color-story-scenes"]
  ].map(([id,subjectId,pathId,stageId,title,lessonId])=>({id:id as string,subjectId:subjectId as "drawing"|"color",pathId:pathId as "drawing-creative-studio"|"color-creative-play",stageId:stageId as string,title:title as string,lessonId:lessonId as string,ageMin:3,ageMax:7})),
  skills:[
    {id:"drawing.space.layers",subjectId:"drawing",title:"Ruang dan lapisan",description:"Mengeksplorasi posisi, ukuran, dan tumpang tindih dalam gambar.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.texture.marks",subjectId:"drawing",title:"Tekstur dan goresan",description:"Memakai variasi goresan untuk kesan permukaan.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.symmetry.exploration",subjectId:"drawing",title:"Keseimbangan dua sisi",description:"Mengeksplorasi bentuk dua sisi tanpa klaim akurasi simetri.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.story.sequence",subjectId:"drawing",title:"Urutan cerita visual",description:"Menyampaikan perubahan sederhana melalui dua momen gambar.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.imagination.invention",subjectId:"drawing",title:"Sketsa imajinasi",description:"Menciptakan objek baru dengan menggabungkan bentuk dan ide.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.palette.neighbor",subjectId:"color",title:"Palet berdekatan",description:"Mengeksplorasi hubungan warna yang terasa selaras secara personal.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.palette.contrast",subjectId:"color",title:"Eksplorasi kontras",description:"Mengeksplorasi perbedaan warna kuat tanpa jawaban tunggal.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.palette.mood",subjectId:"color",title:"Palet suasana",description:"Mengeksplorasi asosiasi personal antara warna dan suasana.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.material.exploration",subjectId:"color",title:"Warna material",description:"Mengeksplorasi warna pada berbagai pola permukaan imajinatif.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.story.scenes",subjectId:"color",title:"Warna adegan cerita",description:"Menggunakan warna untuk membangun suasana cerita sederhana.",domain:"creative",ageMin:4,ageMax:7}
  ],
  activities:[...drawingActivities,...colorActivities]
};
