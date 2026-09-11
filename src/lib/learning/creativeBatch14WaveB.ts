import type { CreativeBatch14ActivitySeed, CreativeBatch14WaveDefinition } from "./creativeBatch14Authoring";

const DRAWING_STAGE = "drawing-objects-scenes";
const COLOR_STAGE = "color-patterns-scenes";

type DrawRow = [string,string,string,string,string,string,1|2|3,boolean,string];
type ColorRow = [string,string,string,string,string,string,1|2|3,boolean,string,string[]];

function draw(packId:string, lessonId:string, skillId:string, rows:DrawRow[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,description,emoji,prompt,guide,difficulty,requiredForStage]) => ({
    kind:"drawing", id, subjectId:"drawing", stageId:DRAWING_STAGE, packId, lessonId, title, description, emoji,
    ageMin:3, ageMax:7, difficulty, requiredForStage, skillId, creativePrompt:prompt, drawingGuide:guide
  }));
}
function color(packId:string, lessonId:string, skillId:string, rows:ColorRow[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,description,emoji,prompt,character,difficulty,requiredForStage,regionLead,regions]) => ({
    kind:"coloring", id, subjectId:"color", stageId:COLOR_STAGE, packId, lessonId, title, description, emoji,
    ageMin:3, ageMax:7, difficulty, requiredForStage, skillId, creativePrompt:prompt, coloringCharacter:character,
    coloringRegions:[regionLead,...regions]
  }));
}

const drawingActivities: CreativeBatch14ActivitySeed[] = [
  ...draw("drawing.pack.objects-from-shapes","drawing-objects-from-shapes","drawing.objects.from_shapes",[
    ["drawing-object-cup","Gambar cangkir","Gabungkan bentuk dasar menjadi cangkir sederhana.","☕","Buat badan cangkir lalu tambahkan pegangan.","▢ + C",1,true,"x"],
    ["drawing-object-boat","Gambar perahu","Susun garis dan segitiga menjadi perahu.","⛵","Buat badan perahu, tiang, lalu layar.","⌒ | △",2,false,"x"],
    ["drawing-object-house","Gambar rumah","Gabungkan persegi, segitiga, pintu, dan jendela.","🏠","Mulai dari badan rumah lalu tambahkan atap.","□ + △",2,false,"x"],
    ["drawing-object-car","Gambar mobil","Susun kotak dan lingkaran menjadi mobil.","🚗","Buat badan mobil lalu dua roda.","▭ + ○ ○",2,false,"x"],
    ["drawing-object-icecream","Gambar es krim","Gabungkan segitiga dan lingkaran menjadi es krim.","🍦","Buat cone lalu satu scoop di atasnya.","▽ + ○",1,false,"x"]
  ]),
  ...draw("drawing.pack.simple-animals","drawing-simple-animals","drawing.animals.simple",[
    ["drawing-animal-cat","Gambar kucing","Buat wajah kucing dari lingkaran dan telinga segitiga.","🐱","Mulai dari kepala, telinga, lalu kumis.","○ △ △ ≋",2,true,"x"],
    ["drawing-animal-fish","Gambar ikan","Gabungkan oval, ekor, dan sirip sederhana.","🐟","Buat badan oval lalu ekor segitiga.","◯ + ◁",1,false,"x"],
    ["drawing-animal-bird","Gambar burung","Latih bentuk badan, sayap, paruh, dan kaki.","🐦","Buat badan bulat, sayap, lalu paruh kecil.","○ ◡ ◁",2,false,"x"],
    ["drawing-animal-butterfly","Gambar kupu-kupu","Buat tubuh tengah dan dua pasang sayap.","🦋","Tarik tubuh di tengah lalu sayap kanan-kiri.","() | ()",2,false,"x"],
    ["drawing-animal-snail","Gambar siput","Gabungkan spiral dengan badan memanjang.","🐌","Buat spiral besar lalu badan di bawahnya.","@ + ︶",2,false,"x"]
  ]),
  ...draw("drawing.pack.plants-nature","drawing-plants-nature","drawing.nature.simple",[
    ["drawing-nature-tree","Gambar pohon","Latih batang, cabang, dan mahkota pohon.","🌳","Buat batang lalu tambahkan cabang dan daun besar.","Y + ☁",2,true,"x"],
    ["drawing-nature-flower","Gambar bunga","Susun pusat bunga, kelopak, batang, dan daun.","🌼","Buat titik tengah lalu kelopak mengelilinginya.","✿ |",1,false,"x"],
    ["drawing-nature-leaf","Gambar daun","Latih garis lengkung dan tulang daun.","🍃","Buat dua lengkung bertemu lalu garis tengah.","() + |",1,false,"x"],
    ["drawing-nature-cloud-rain","Awan dan hujan","Gabungkan lengkung awan dengan garis hujan.","🌧️","Buat awan bergelombang lalu garis hujan di bawah.","☁ + |||",1,false,"x"],
    ["drawing-nature-rainbow","Gambar pelangi","Latih beberapa lengkung paralel.","🌈","Tarik tiga lengkung besar yang mengikuti arah sama.","⌒⌒⌒",2,false,"x"]
  ]),
  ...draw("drawing.pack.faces-people","drawing-faces-people","drawing.people.faces",[
    ["drawing-face-happy","Wajah senang","Tambahkan mata dan senyum pada bentuk wajah.","🙂","Buat wajah, dua mata, lalu senyum melengkung.","○ •• ◡",1,true,"x"],
    ["drawing-face-surprised","Wajah kaget","Eksplorasi ekspresi dengan mulut berbentuk O.","😮","Buat mata lalu mulut bundar kecil.","○ •• ○",1,false,"x"],
    ["drawing-face-hair","Wajah dengan rambut","Tambahkan variasi garis rambut pada wajah sederhana.","🧑","Buat wajah lalu pilih garis rambutmu sendiri.","○ + ≋",2,false,"x"],
    ["drawing-person-stick","Orang sederhana","Susun kepala, badan, tangan, dan kaki dari garis.","🧍","Mulai dari kepala lalu badan, tangan, dan kaki.","○ | /\\",2,false,"x"],
    ["drawing-people-friends","Dua teman","Buat dua figur sederhana berdampingan.","🧑‍🤝‍🧑","Gambar dua orang sederhana dengan ukuran berbeda boleh.","○|  ○|",3,false,"x"]
  ]),
  ...draw("drawing.pack.simple-scenes","drawing-simple-scenes","drawing.scenes.simple",[
    ["drawing-scene-park","Taman kecil","Gabungkan pohon, rumput, dan matahari dalam satu gambar.","🏞️","Buat tanah lalu pilih tiga benda untuk tamanmu.","☀ 🌳 〰",2,true,"x"],
    ["drawing-scene-beach","Pantai sederhana","Gabungkan garis horizon, ombak, dan matahari.","🏖️","Tarik horizon lalu ombak dan satu benda pantai.","— ≋ ☀",2,false,"x"],
    ["drawing-scene-road","Jalan dan rumah","Latih dua garis jalan menuju rumah sederhana.","🛣️","Buat dua garis jalan lalu rumah di ujung.","\\ / + 🏠",3,false,"x"],
    ["drawing-scene-night","Langit malam","Gabungkan bulan, bintang, dan garis tanah.","🌙","Buat bulan, beberapa bintang, lalu tanah.","☾ ✦ ✦ —",2,false,"x"],
    ["drawing-scene-garden","Kebun imajinasi","Susun beberapa bunga, daun, dan jalan kecil.","🌷","Isi kebunmu dengan bentuk alam sederhana.","✿ 🍃 〰",3,false,"x"]
  ])
];

const colorActivities: CreativeBatch14ActivitySeed[] = [
  ...color("color.pack.warm-cool-play","color-warm-cool-play","color.temperature.exploration",[
    ["color-warm-sun","Warna hangat matahari","Eksplorasi warna hangat pada matahari.","☀️","Coba warna yang terasa hangat atau cerah.","sun",1,true,"pusat",["sinar","langit"]],
    ["color-warm-fire","Warna hangat api","Coba beberapa warna pada bentuk api.","🔥","Pilih kombinasi warna hangat versimu.","fire",2,false,"api-dalam",["api-luar","latar"]],
    ["color-cool-ocean","Warna sejuk laut","Eksplorasi warna sejuk pada laut.","🌊","Coba beberapa warna yang terasa sejuk.","ocean",1,false,"air",["ombak","langit"]],
    ["color-cool-snow","Warna sejuk salju","Mainkan warna terang dan sejuk pada suasana salju.","❄️","Pilih warna sejuk untuk beberapa bagian.","snow",2,false,"salju",["langit","syal"]],
    ["color-warm-cool-balloons","Balon hangat dan sejuk","Bandingkan dua kelompok warna secara bebas.","🎈","Warnai balon dengan dua suasana warna berbeda.","balloons",2,false,"balon-a",["balon-b","balon-c"]]
  ]),
  ...color("color.pack.repeated-patterns","color-repeated-patterns","color.patterns.exploration",[
    ["color-pattern-stripes","Pola garis","Ulangi warna pada beberapa garis besar.","▥","Buat pola warna berulang pada garis.","stripes",1,true,"garis-1",["garis-2","garis-3"]],
    ["color-pattern-dots","Pola titik","Coba ritme warna pada kumpulan titik.","🔵","Pilih warna berbeda untuk titik berulang.","dots",1,false,"titik-1",["titik-2","titik-3"]],
    ["color-pattern-checker","Pola kotak","Eksplorasi pergantian warna pada kotak.","▦","Coba dua atau tiga warna secara bergantian.","checker",2,false,"kotak-a",["kotak-b","kotak-c"]],
    ["color-pattern-zigzag","Pola zigzag","Bermain dengan urutan warna pada zigzag.","〽️","Isi bagian zigzag dengan pola warna pilihanmu.","zigzag",2,false,"bagian-1",["bagian-2","bagian-3"]],
    ["color-pattern-circles","Lingkaran berulang","Coba kombinasi warna pada lingkaran yang berulang.","⭕","Buat pola warna di tiga lingkaran.","circles",2,false,"lingkaran-1",["lingkaran-2","lingkaran-3"]]
  ]),
  ...color("color.pack.nature-scenes","color-nature-scenes","color.scenes.nature",[
    ["color-scene-meadow","Padang rumput","Warnai beberapa bagian pemandangan padang.","🌿","Pilih warna untuk langit, rumput, dan bunga.","meadow",2,true,"langit",["rumput","bunga"]],
    ["color-scene-rainy","Hari hujan","Eksplorasi suasana warna pada hari hujan.","🌧️","Warnai awan, hujan, dan payung sesukamu.","rainy",2,false,"awan",["hujan","payung"]],
    ["color-scene-sunset","Senja","Coba palet bebas untuk langit senja.","🌅","Buat suasana senja dengan pilihan warnamu.","sunset",2,false,"langit",["matahari","tanah"]],
    ["color-scene-forest","Hutan kecil","Eksplorasi beberapa warna pada pepohonan.","🌲","Warnai daun, batang, dan latar secara bebas.","forest",2,false,"daun",["batang","latar"]],
    ["color-scene-pond","Kolam","Mainkan warna air, daun, dan bunga kolam.","🪷","Pilih warna untuk tiga bagian kolam.","pond",3,false,"air",["daun","bunga"]]
  ]),
  ...color("color.pack.transport-objects","color-transport-objects","color.transport.exploration",[
    ["color-transport-car","Mobil warna-warni","Eksplorasi warna badan dan roda mobil.","🚗","Pilih warna mobil versimu.","car",1,true,"badan",["roda","jendela"]],
    ["color-transport-bus","Bus","Coba kombinasi warna pada bus besar.","🚌","Warnai badan, jendela, dan roda.","bus",2,false,"badan",["jendela","roda"]],
    ["color-transport-train","Kereta","Mainkan warna pada beberapa gerbong.","🚆","Pilih warna berbeda untuk bagian kereta.","train",2,false,"lokomotif",["gerbong","roda"]],
    ["color-transport-boat","Perahu","Eksplorasi warna badan, layar, dan air.","⛵","Warnai perahu dan sekitarnya secara bebas.","boat",2,false,"badan",["layar","air"]],
    ["color-transport-rocket","Roket","Coba warna kontras pada roket.","🚀","Pilih warna untuk badan, jendela, dan api.","rocket",3,false,"badan",["jendela","api"]]
  ]),
  ...color("color.pack.fantasy-characters","color-fantasy-characters","color.characters.fantasy",[
    ["color-fantasy-dragon","Naga ramah","Warnai bagian naga imajinatif tanpa aturan benar-salah.","🐉","Pilih warna sisik, sayap, dan perut.","dragon",2,true,"sisik",["sayap","perut"]],
    ["color-fantasy-unicorn","Unicorn","Eksplorasi warna pada surai dan tubuh unicorn.","🦄","Buat unicorn versimu sendiri.","unicorn",2,false,"tubuh",["surai","tanduk"]],
    ["color-fantasy-robot","Robot imajinasi","Campur warna pada panel robot.","🤖","Warnai kepala, badan, dan tombol.","robot-fantasy",2,false,"kepala",["badan","tombol"]],
    ["color-fantasy-monster","Monster lucu","Pilih warna bebas untuk monster ramah.","👾","Warnai badan, bintik, dan mata.","monster",2,false,"badan",["bintik","mata"]],
    ["color-fantasy-castle","Kastel dongeng","Eksplorasi warna pada menara dan bendera.","🏰","Buat kastel dongeng dengan paletmu.","castle",3,false,"menara",["atap","bendera"]]
  ])
];

export const CREATIVE_BATCH14_WAVE_B: CreativeBatch14WaveDefinition = {
  wave:"B",
  stages:[
    {id:DRAWING_STAGE,subjectId:"drawing",title:"Objek & Adegan Sederhana",subtitle:"Gabungkan bentuk menjadi objek, makhluk, orang, dan pemandangan sederhana.",emoji:"✏️"},
    {id:COLOR_STAGE,subjectId:"color",title:"Pola & Adegan Warna",subtitle:"Eksplorasi suasana, pola, pemandangan, kendaraan, dan karakter dengan pilihan warna bebas.",emoji:"🎨"}
  ],
  lessons:[
    {id:"drawing-objects-from-shapes",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Objek dari Bentuk",objective:"Menggabungkan bentuk dasar menjadi objek familiar.",ageMin:3,ageMax:7},
    {id:"drawing-simple-animals",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Hewan Sederhana",objective:"Menyusun garis dan bentuk menjadi hewan sederhana.",ageMin:3,ageMax:7},
    {id:"drawing-plants-nature",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Alam",objective:"Menggambar bentuk alam dengan garis sederhana.",ageMin:3,ageMax:7},
    {id:"drawing-faces-people",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Wajah & Orang",objective:"Mengeksplorasi wajah, ekspresi, dan figur sederhana.",ageMin:3,ageMax:7},
    {id:"drawing-simple-scenes",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Adegan Sederhana",objective:"Menggabungkan beberapa objek menjadi satu adegan.",ageMin:4,ageMax:7},
    {id:"color-warm-cool-play",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Hangat & Sejuk",objective:"Mengeksplorasi kesan warna hangat dan sejuk tanpa jawaban tunggal.",ageMin:3,ageMax:7},
    {id:"color-repeated-patterns",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Pola Berulang",objective:"Mencoba pengulangan warna pada pola visual sederhana.",ageMin:3,ageMax:7},
    {id:"color-nature-scenes",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Adegan Alam",objective:"Mewarnai beberapa bagian pemandangan alam secara bebas.",ageMin:3,ageMax:7},
    {id:"color-transport-objects",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Kendaraan",objective:"Mengeksplorasi warna pada kendaraan dan bagian-bagiannya.",ageMin:3,ageMax:7},
    {id:"color-fantasy-characters",subjectId:"color",pathId:"color-creative-play",stageId:COLOR_STAGE,title:"Karakter Fantasi",objective:"Menciptakan kombinasi warna bebas untuk karakter imajinatif.",ageMin:4,ageMax:7}
  ],
  packs:[
    ["drawing.pack.objects-from-shapes","drawing","drawing-creative-studio",DRAWING_STAGE,"Objects from Shapes","drawing-objects-from-shapes"],
    ["drawing.pack.simple-animals","drawing","drawing-creative-studio",DRAWING_STAGE,"Simple Animals","drawing-simple-animals"],
    ["drawing.pack.plants-nature","drawing","drawing-creative-studio",DRAWING_STAGE,"Plants and Nature","drawing-plants-nature"],
    ["drawing.pack.faces-people","drawing","drawing-creative-studio",DRAWING_STAGE,"Faces and People","drawing-faces-people"],
    ["drawing.pack.simple-scenes","drawing","drawing-creative-studio",DRAWING_STAGE,"Simple Scenes","drawing-simple-scenes"],
    ["color.pack.warm-cool-play","color","color-creative-play",COLOR_STAGE,"Warm and Cool Play","color-warm-cool-play"],
    ["color.pack.repeated-patterns","color","color-creative-play",COLOR_STAGE,"Repeated Patterns","color-repeated-patterns"],
    ["color.pack.nature-scenes","color","color-creative-play",COLOR_STAGE,"Nature Scenes","color-nature-scenes"],
    ["color.pack.transport-objects","color","color-creative-play",COLOR_STAGE,"Transport Objects","color-transport-objects"],
    ["color.pack.fantasy-characters","color","color-creative-play",COLOR_STAGE,"Fantasy Characters","color-fantasy-characters"]
  ].map(([id,subjectId,pathId,stageId,title,lessonId])=>({id:id as string,subjectId:subjectId as "drawing"|"color",pathId:pathId as "drawing-creative-studio"|"color-creative-play",stageId:stageId as string,title:title as string,lessonId:lessonId as string,ageMin:3,ageMax:7})),
  skills:[
    {id:"drawing.objects.from_shapes",subjectId:"drawing",title:"Objek dari bentuk",description:"Berlatih menyusun bentuk menjadi objek familiar.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.animals.simple",subjectId:"drawing",title:"Hewan sederhana",description:"Berlatih menyusun garis dan bentuk menjadi hewan sederhana.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.nature.simple",subjectId:"drawing",title:"Gambar alam sederhana",description:"Berlatih menggambar bentuk alam melalui petunjuk visual.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.people.faces",subjectId:"drawing",title:"Wajah dan figur",description:"Berlatih mengeksplorasi wajah dan figur sederhana.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.scenes.simple",subjectId:"drawing",title:"Adegan sederhana",description:"Berlatih menggabungkan beberapa unsur menjadi satu adegan.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.temperature.exploration",subjectId:"color",title:"Eksplorasi hangat dan sejuk",description:"Mencoba kesan warna hangat dan sejuk tanpa penilaian benar-salah.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.patterns.exploration",subjectId:"color",title:"Eksplorasi pola warna",description:"Mencoba pengulangan warna dalam pola sederhana.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.scenes.nature",subjectId:"color",title:"Warna adegan alam",description:"Mengeksplorasi warna pada beberapa bagian pemandangan.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.transport.exploration",subjectId:"color",title:"Warna kendaraan",description:"Mengeksplorasi pilihan warna pada kendaraan dan komponennya.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.characters.fantasy",subjectId:"color",title:"Warna karakter fantasi",description:"Menciptakan kombinasi warna bebas pada karakter imajinatif.",domain:"creative",ageMin:4,ageMax:7}
  ],
  activities:[...drawingActivities,...colorActivities]
};
