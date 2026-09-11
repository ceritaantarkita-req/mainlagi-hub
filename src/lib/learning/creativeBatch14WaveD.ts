import type { CreativeBatch14ActivitySeed, CreativeBatch14WaveDefinition } from "./creativeBatch14Authoring";

const DRAWING_STAGE = "drawing-composition-design-capstone";
const COLOR_STAGE = "color-palette-scene-capstone";

type Row = [id:string, title:string, emoji:string, difficulty:1|2|3];

function drawPack(packId:string, lessonId:string, skillId:string, rows:Row[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,emoji,difficulty],index)=>({
    kind:"drawing",id,subjectId:"drawing",stageId:DRAWING_STAGE,packId,lessonId,title,
    description:`Eksplorasi gambar kreatif: ${title}.`,emoji,ageMin:3,ageMax:7,difficulty,
    requiredForStage:index===0,skillId,creativePrompt:`Ciptakan ${title.toLowerCase()} dengan keputusan visual versimu sendiri.`,
    drawingGuide:`Mulai dari bentuk besar, lalu tambahkan detail untuk ${title.toLowerCase()}.`
  }));
}
function colorPack(packId:string, lessonId:string, skillId:string, rows:Row[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,emoji,difficulty],index)=>({
    kind:"coloring",id,subjectId:"color",stageId:COLOR_STAGE,packId,lessonId,title,
    description:`Eksplorasi palet kreatif: ${title}.`,emoji,ageMin:3,ageMax:7,difficulty,
    requiredForStage:index===0,skillId,creativePrompt:`Bangun suasana ${title.toLowerCase()} dengan pilihan warna versimu; tidak ada satu jawaban benar.`,
    coloringCharacter:id.replace(/^color-/,""),coloringRegions:[`${id}-utama`,`${id}-detail`,`${id}-latar`]
  }));
}

const drawingActivities: CreativeBatch14ActivitySeed[] = [
  ...drawPack("drawing.pack.composition-focus","drawing-composition-focus","drawing.composition.focus",[
    ["drawing-focus-big-small","Besar dan Kecil","🔶",2],["drawing-focus-center-side","Pusat dan Samping","🎯",2],
    ["drawing-focus-frame","Bingkai dalam Gambar","🖼️",2],["drawing-focus-path","Jalur Menuju Fokus","🛤️",3],
    ["drawing-focus-crowd","Satu Tokoh di Keramaian","👥",3]
  ]),
  ...drawPack("drawing.pack.character-design","drawing-character-design","drawing.character.design",[
    ["drawing-character-hat","Karakter Bertopi","🧢",1],["drawing-character-job","Karakter dengan Profesi","🧑‍🚀",2],
    ["drawing-character-emotion","Karakter dan Emosi","🙂",2],["drawing-character-pet","Karakter dan Hewan Teman","🐾",2],
    ["drawing-character-costume","Kostum Imajinasi","🦸",3]
  ]),
  ...drawPack("drawing.pack.world-maps","drawing-world-maps","drawing.world.mapping",[
    ["drawing-map-bedroom","Peta Kamar","🛏️",2],["drawing-map-playground","Peta Taman Bermain","🛝",2],
    ["drawing-map-treasure","Peta Harta Karun","🗺️",3],["drawing-map-island","Pulau Imajinasi","🏝️",3],
    ["drawing-map-space-base","Pangkalan Luar Angkasa","🚀",3]
  ]),
  ...drawPack("drawing.pack.visual-design","drawing-visual-design","drawing.visual.design",[
    ["drawing-design-badge","Lencana Pribadi","🏅",2],["drawing-design-flag","Bendera Imajinasi","🚩",2],
    ["drawing-design-book-cover","Sampul Buku","📘",3],["drawing-design-sign","Papan Petunjuk","🪧",2],
    ["drawing-design-poster","Poster Tanpa Teks","🌟",3]
  ]),
  ...drawPack("drawing.pack.capstone-challenges","drawing-capstone-challenges","drawing.capstone.exploration",[
    ["drawing-capstone-favorite-place","Tempat Favorit Imajinatif","🏡",3],["drawing-capstone-new-creature","Makhluk Baru","🐲",3],
    ["drawing-capstone-machine","Mesin Ajaib","⚙️",3],["drawing-capstone-mini-story","Cerita dalam Satu Gambar","📖",3],
    ["drawing-capstone-free-studio","Studio Bebas","✨",3]
  ])
];

const colorActivities: CreativeBatch14ActivitySeed[] = [
  ...colorPack("color.pack.limited-palettes","color-limited-palettes","color.palette.limited",[
    ["color-limited-two-flower","Dua Warna untuk Bunga","🌼",1],["color-limited-three-fish","Tiga Warna untuk Ikan","🐠",2],
    ["color-limited-two-house","Dua Warna untuk Rumah","🏠",2],["color-limited-three-robot","Tiga Warna untuk Robot","🤖",2],
    ["color-limited-three-pattern","Tiga Warna untuk Pola","🔷",3]
  ]),
  ...colorPack("color.pack.time-season","color-time-season","color.scene.time_season",[
    ["color-time-morning","Warna Pagi","🌅",2],["color-time-noon","Warna Siang","☀️",2],
    ["color-time-evening","Warna Sore","🌇",2],["color-time-night","Warna Malam","🌙",2],
    ["color-season-rainy","Suasana Musim Hujan","🌧️",3]
  ]),
  ...colorPack("color.pack.character-palettes","color-character-palettes","color.character.palette",[
    ["color-character-hero","Palet Pahlawan","🦸",2],["color-character-explorer","Palet Penjelajah","🧭",2],
    ["color-character-chef","Palet Koki","👨‍🍳",2],["color-character-space","Palet Astronaut","🧑‍🚀",3],
    ["color-character-creature","Palet Makhluk Imajinasi","👾",3]
  ]),
  ...colorPack("color.pack.scene-storytelling","color-scene-storytelling","color.scene.storytelling",[
    ["color-scene-welcome","Adegan Sambutan","👋",2],["color-scene-search","Adegan Mencari","🔎",2],
    ["color-scene-celebrate","Adegan Perayaan","🎊",2],["color-scene-journey","Adegan Perjalanan","🎒",3],
    ["color-scene-discovery","Adegan Penemuan","💡",3]
  ]),
  ...colorPack("color.pack.capstone-palettes","color-capstone-palettes","color.capstone.exploration",[
    ["color-capstone-dream-room","Kamar Impian","🛏️",3],["color-capstone-fantasy-garden","Kebun Fantasi","🌺",3],
    ["color-capstone-future-city","Kota Masa Depan","🌆",3],["color-capstone-story-world","Dunia Cerita","🌍",3],
    ["color-capstone-free-palette","Palet Bebas","🎨",3]
  ])
];

export const CREATIVE_BATCH14_WAVE_D: CreativeBatch14WaveDefinition = {
  wave:"D",
  stages:[
    {id:DRAWING_STAGE,subjectId:"drawing",title:"Komposisi, Desain & Studio Akhir",subtitle:"Eksplorasi fokus visual, karakter, peta, desain, dan tantangan gambar terbuka.",emoji:"✏️"},
    {id:COLOR_STAGE,subjectId:"color",title:"Palet, Adegan & Studio Akhir",subtitle:"Eksplorasi palet terbatas, waktu, karakter, adegan, dan tantangan warna terbuka.",emoji:"🎨"}
  ],
  lessons:[
    {id:"drawing-composition-focus",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Komposisi & Fokus",objective:"Mengeksplorasi ukuran, posisi, bingkai, dan jalur untuk mengarahkan perhatian visual.",ageMin:4,ageMax:7},
    {id:"drawing-character-design",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Desain Karakter",objective:"Menciptakan variasi karakter melalui atribut, emosi, teman, dan kostum.",ageMin:3,ageMax:7},
    {id:"drawing-world-maps",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Peta & Dunia",objective:"Menyusun tempat dan jalur sederhana menjadi peta atau dunia imajinatif.",ageMin:4,ageMax:7},
    {id:"drawing-visual-design",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Desain Visual",objective:"Mengeksplorasi simbol, bentuk, dan susunan visual untuk benda desain sederhana.",ageMin:4,ageMax:7},
    {id:"drawing-capstone-challenges",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Studio Gambar Bebas",objective:"Menggabungkan pengalaman menggambar sebelumnya dalam tantangan kreatif terbuka.",ageMin:4,ageMax:7},
    {id:"color-limited-palettes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Palet Terbatas",objective:"Mengeksplorasi bagaimana sedikit warna dapat dipakai dengan banyak cara.",ageMin:3,ageMax:7},
    {id:"color-time-season",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Waktu & Musim",objective:"Mengeksplorasi perubahan suasana warna berdasarkan waktu dan kondisi lingkungan.",ageMin:3,ageMax:7},
    {id:"color-character-palettes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Palet Karakter",objective:"Menciptakan identitas visual karakter melalui kombinasi warna personal.",ageMin:4,ageMax:7},
    {id:"color-scene-storytelling",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Warna & Cerita",objective:"Menggunakan warna untuk mendukung suasana adegan cerita sederhana.",ageMin:4,ageMax:7},
    {id:"color-capstone-palettes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Studio Warna Bebas",objective:"Menggabungkan pengalaman warna sebelumnya dalam tantangan kreatif terbuka.",ageMin:4,ageMax:7}
  ],
  packs:[
    ["drawing.pack.composition-focus","drawing","drawing-creative-studio",DRAWING_STAGE,"Composition and Focus","drawing-composition-focus"],
    ["drawing.pack.character-design","drawing","drawing-creative-studio",DRAWING_STAGE,"Character Design","drawing-character-design"],
    ["drawing.pack.world-maps","drawing","drawing-creative-studio",DRAWING_STAGE,"World Maps","drawing-world-maps"],
    ["drawing.pack.visual-design","drawing","drawing-creative-studio",DRAWING_STAGE,"Visual Design","drawing-visual-design"],
    ["drawing.pack.capstone-challenges","drawing","drawing-creative-studio",DRAWING_STAGE,"Drawing Capstone Challenges","drawing-capstone-challenges"],
    ["color.pack.limited-palettes","color","color-creative-play",COLOR_STAGE,"Limited Palettes","color-limited-palettes"],
    ["color.pack.time-season","color","color-creative-play",COLOR_STAGE,"Time and Season","color-time-season"],
    ["color.pack.character-palettes","color","color-creative-play",COLOR_STAGE,"Character Palettes","color-character-palettes"],
    ["color.pack.scene-storytelling","color","color-creative-play",COLOR_STAGE,"Scene Storytelling","color-scene-storytelling"],
    ["color.pack.capstone-palettes","color","color-creative-play",COLOR_STAGE,"Color Capstone Challenges","color-capstone-palettes"]
  ].map(([id,subjectId,pathId,stageId,title,lessonId])=>({id:id as string,subjectId:subjectId as "drawing"|"color",pathId:pathId as "drawing-creative-studio"|"color-creative-play",stageId:stageId as string,title:title as string,lessonId:lessonId as string,ageMin:3,ageMax:7})),
  skills:[
    {id:"drawing.composition.focus",subjectId:"drawing",title:"Komposisi dan fokus",description:"Mengeksplorasi ukuran, posisi, bingkai, dan jalur untuk fokus visual.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.character.design",subjectId:"drawing",title:"Desain karakter",description:"Mengeksplorasi atribut dan identitas visual karakter.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.world.mapping",subjectId:"drawing",title:"Peta dan dunia",description:"Menyusun tempat dan jalur menjadi peta atau dunia imajinatif.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.visual.design",subjectId:"drawing",title:"Desain visual",description:"Mengeksplorasi simbol dan susunan visual untuk desain sederhana.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.capstone.exploration",subjectId:"drawing",title:"Eksplorasi gambar akhir",description:"Menggabungkan pengalaman gambar dalam tantangan kreatif terbuka.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.palette.limited",subjectId:"color",title:"Palet terbatas",description:"Mengeksplorasi variasi penggunaan sejumlah kecil warna.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.scene.time_season",subjectId:"color",title:"Waktu dan musim",description:"Mengeksplorasi suasana warna berdasarkan waktu dan kondisi lingkungan.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.character.palette",subjectId:"color",title:"Palet karakter",description:"Menciptakan identitas visual karakter melalui pilihan warna personal.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.scene.storytelling",subjectId:"color",title:"Warna dalam cerita",description:"Menggunakan warna untuk mendukung suasana adegan cerita.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.capstone.exploration",subjectId:"color",title:"Eksplorasi warna akhir",description:"Menggabungkan pengalaman warna dalam tantangan kreatif terbuka.",domain:"creative",ageMin:4,ageMax:7}
  ],
  activities:[...drawingActivities,...colorActivities]
};
