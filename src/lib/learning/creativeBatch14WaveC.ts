import type { CreativeBatch14ActivitySeed, CreativeBatch14WaveDefinition } from "./creativeBatch14Authoring";

const DRAWING_STAGE = "drawing-space-story-imagination";
const COLOR_STAGE = "color-mood-material-story";

type DrawRow = [string,string,string,string,string,string,1|2|3,boolean];
type ColorRow = [string,string,string,string,string,string,1|2|3,boolean,string[]];

function draw(packId:string, lessonId:string, skillId:string, rows:DrawRow[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,description,emoji,prompt,guide,difficulty,requiredForStage]) => ({
    kind:"drawing",id,subjectId:"drawing",stageId:DRAWING_STAGE,packId,lessonId,title,description,emoji,
    ageMin:3,ageMax:7,difficulty,requiredForStage,skillId,creativePrompt:prompt,drawingGuide:guide
  }));
}
function color(packId:string, lessonId:string, skillId:string, rows:ColorRow[]): CreativeBatch14ActivitySeed[] {
  return rows.map(([id,title,description,emoji,prompt,character,difficulty,requiredForStage,regions]) => ({
    kind:"coloring",id,subjectId:"color",stageId:COLOR_STAGE,packId,lessonId,title,description,emoji,
    ageMin:3,ageMax:7,difficulty,requiredForStage,skillId,creativePrompt:prompt,coloringCharacter:character,coloringRegions:[...regions]
  }));
}

const drawingActivities: CreativeBatch14ActivitySeed[] = [
  ...draw("drawing.pack.space-layers","drawing-space-layers","drawing.space.layers",[
    ["drawing-space-near-far","Dekat dan jauh","Eksplorasi ukuran objek untuk memberi rasa dekat dan jauh.","🏔️","Buat satu benda besar di depan dan satu benda kecil di belakang.","besar depan • kecil belakang",2,true],
    ["drawing-space-overlap","Bentuk bertumpuk","Coba menumpuk beberapa bentuk sehingga sebagian tertutup.","◒","Gambar tiga bentuk yang saling menutupi sedikit.","○ di depan □ di belakang",2,false],
    ["drawing-space-horizon","Garis horizon","Gunakan garis pemisah untuk membuat ruang langit dan tanah.","🌄","Tarik garis horizon lalu isi benda di atas dan bawahnya.","— horizon + objek",2,false],
    ["drawing-space-path-depth","Jalan mengecil","Eksplorasi dua garis yang mendekat ke kejauhan.","🛤️","Buat jalan lebar di bawah lalu makin sempit ke atas.","/ \\ menuju titik jauh",3,false],
    ["drawing-space-window-view","Pemandangan jendela","Bingkai sebuah pemandangan sederhana di dalam bentuk jendela.","🪟","Buat bingkai lalu isi pemandangan pilihanmu.","□ bingkai + pemandangan",2,false]
  ]),
  ...draw("drawing.pack.texture-marks","drawing-texture-marks","drawing.texture.marks",[
    ["drawing-texture-fur","Tekstur bulu","Coba goresan pendek berulang untuk kesan bulu.","🐻","Isi satu bentuk dengan garis-garis pendek yang berbeda arah.","//// garis pendek",1,true],
    ["drawing-texture-scales","Tekstur sisik","Eksplorasi lengkung kecil berulang seperti sisik.","🐟","Isi area dengan deretan lengkung kecil.","⌒⌒⌒ berulang",2,false],
    ["drawing-texture-brick","Tekstur bata","Susun garis mendatar dan pendek menjadi pola bata.","🧱","Buat beberapa baris kotak tidak harus sama besar.","▭ ▭ pola bata",2,false],
    ["drawing-texture-grass","Tekstur rumput","Gunakan banyak garis kecil untuk membuat hamparan rumput.","🌱","Tambahkan garis pendek naik dari garis tanah.","— + |||",1,false],
    ["drawing-texture-water","Tekstur air","Gunakan garis bergelombang berulang untuk rasa air.","💧","Buat beberapa gelombang dengan panjang berbeda.","~~~~ berlapis",2,false]
  ]),
  ...draw("drawing.pack.symmetry-play","drawing-symmetry-play","drawing.symmetry.exploration",[
    ["drawing-symmetry-butterfly","Sayap kiri-kanan","Eksplorasi dua sisi kupu-kupu yang terinspirasi satu sama lain.","🦋","Buat tubuh tengah lalu sayap di kedua sisi; tidak harus sama persis.","( sayap ) | ( sayap )",2,true],
    ["drawing-symmetry-mask","Topeng dua sisi","Buat topeng dengan detail kanan-kiri yang saling menanggapi.","🎭","Buat bentuk topeng lalu tambahkan pola di kedua sisi.","◁ wajah tengah ▷",2,false],
    ["drawing-symmetry-flower","Bunga radial","Eksplorasi kelopak yang mengelilingi pusat.","🌸","Buat pusat lalu tambahkan kelopak mengitari pusat.","• + kelopak sekeliling",2,false],
    ["drawing-symmetry-robot","Robot seimbang","Eksplorasi lengan dan kaki di dua sisi badan robot.","🤖","Buat badan tengah lalu anggota tubuh kanan-kiri.","—[□]— / \",3,false],
    ["drawing-symmetry-kite","Layang-layang dua sisi","Buat bentuk layang-layang dan pola yang terbagi oleh garis tengah.","🪁","Buat bentuk wajik lalu garis tengah dan pola bebas.","◇ + |",2,false]
  ]),
  ...draw("drawing.pack.story-sequence","drawing-story-sequence","drawing.story.sequence",[
    ["drawing-story-seed-sprout","Biji menjadi tunas","Gambar dua momen sederhana: biji lalu tunas.","🌱","Bagi kanvas menjadi dua bagian dan gambar perubahan sederhana.","biji → tunas",2,true],
    ["drawing-story-rain-sun","Hujan lalu cerah","Buat dua cuaca dalam urutan sederhana.","🌦️","Gambar awan hujan lalu matahari di bagian berikutnya.","🌧 → ☀",2,false],
    ["drawing-story-ball-roll","Bola bergerak","Eksplorasi posisi bola dari satu tempat ke tempat lain.","⚽","Gambar bola di dua posisi dan tambahkan garis gerak bila mau.","○ 〰→ ○",2,false],
    ["drawing-story-build-house","Rumah bertambah","Buat urutan bentuk dasar hingga menjadi rumah sederhana.","🏠","Gambar bentuk awal lalu versi yang lebih lengkap.","□ → □+△",3,false],
    ["drawing-story-friend-wave","Teman menyapa","Buat dua panel kecil tentang teman yang datang dan menyapa.","👋","Gunakan dua bingkai untuk dua momen cerita.","panel 1 | panel 2",3,false]
  ]),
  ...draw("drawing.pack.invention-sketches","drawing-invention-sketches","drawing.imagination.invention",[
    ["drawing-invent-flying-car","Mobil terbang","Gabungkan bagian mobil dengan ide alat terbang.","🚗","Tambahkan sayap, baling-baling, atau ide lain ke kendaraan.","mobil + ide terbang",3,true],
    ["drawing-invent-helper-robot","Robot penolong","Rancang robot dengan satu alat penolong pilihanmu.","🤖","Mulai dari badan robot lalu tambahkan alat khusus.","□ robot + alat",3,false],
    ["drawing-invent-fantasy-house","Rumah imajinasi","Ciptakan rumah dengan bentuk yang tidak biasa.","🏡","Gabungkan bentuk besar dan kecil menjadi rumah khayalan.","bentuk bebas + pintu",2,false],
    ["drawing-invent-animal-mix","Hewan campuran","Gabungkan ciri dua hewan menjadi makhluk baru.","🦄","Pilih dua ciri hewan lalu satukan dalam satu gambar.","ciri A + ciri B",3,false],
    ["drawing-invent-playground","Taman bermain baru","Rancang alat bermain dari garis, bentuk, dan jalur.","🛝","Buat satu alat bermain yang belum pernah kamu lihat.","bentuk + jalur + tangga",3,false]
  ])
];

const colorActivities: CreativeBatch14ActivitySeed[] = [
  ...color("color.pack.neighbor-palettes","color-neighbor-palettes","color.palette.neighbor",[
    ["color-neighbor-leaves","Daun satu keluarga warna","Eksplorasi beberapa warna yang terasa saling dekat pada daun.","🍃","Pilih tiga warna yang menurutmu terasa cocok berdampingan.","leaves-neighbor",2,true,["daun-a","daun-b","daun-c"]],
    ["color-neighbor-fish","Ikan palet dekat","Coba variasi warna yang masih terasa satu suasana.","🐠","Warnai badan, sirip, dan ekor dengan palet yang kamu pilih.","fish-neighbor",2,false,["badan","sirip","ekor"]],
    ["color-neighbor-flowers","Bunga palet lembut","Eksplorasi keluarga warna pada beberapa bunga.","💐","Buat tiga bagian bunga terasa berhubungan versimu.","flowers-neighbor",2,false,["bunga-a","bunga-b","daun"]],
    ["color-neighbor-sky","Langit berlapis","Coba tiga warna yang berdekatan untuk lapisan langit.","🌤️","Isi lapisan langit dengan transisi warna bebas.","sky-neighbor",2,false,["langit-atas","langit-tengah","langit-bawah"]],
    ["color-neighbor-shell","Kerang palet dekat","Eksplorasi beberapa warna serumpun pada pola kerang.","🐚","Pilih variasi warna untuk tiga pita kerang.","shell-neighbor",2,false,["pita-a","pita-b","pita-c"]]
  ]),
  ...color("color.pack.contrast-play","color-contrast-play","color.palette.contrast",[
    ["color-contrast-kite","Layang-layang kontras","Eksplorasi dua atau tiga warna yang terasa sangat berbeda.","🪁","Coba warna yang membuat bagian layang-layang terlihat berbeda jelas.","kite-contrast",2,true,["panel-a","panel-b","ekor"]],
    ["color-contrast-bird","Burung kontras","Mainkan perbedaan warna antara badan dan sayap.","🐦","Pilih warna yang menurutmu punya kontras menarik.","bird-contrast",2,false,["badan","sayap","paruh"]],
    ["color-contrast-sign","Papan bentuk","Eksplorasi warna latar dan bentuk yang menonjol.","🔶","Buat bentuk utama terlihat menonjol dengan pilihanmu.","sign-contrast",2,false,["latar","bentuk","bingkai"]],
    ["color-contrast-umbrella","Payung kontras","Coba panel payung dengan warna berbeda kuat.","☂️","Beri tiap panel suasana warna berbeda.","umbrella-contrast",2,false,["panel-a","panel-b","gagang"]],
    ["color-contrast-space","Planet dan ruang","Eksplorasi planet terang dengan latar ruang gelap atau sebaliknya.","🪐","Pilih kontras versimu antara planet dan angkasa.","space-contrast",3,false,["planet","cincin","angkasa"]]
  ]),
  ...color("color.pack.mood-palettes","color-mood-palettes","color.palette.mood",[
    ["color-mood-cheerful","Suasana ceria","Pilih warna yang menurutmu terasa ceria.","😊","Warnai tiga bagian adegan dengan palet ceria versimu.","mood-cheerful",1,true,["langit","objek","tanah"]],
    ["color-mood-calm","Suasana tenang","Eksplorasi warna yang menurutmu terasa tenang.","😌","Buat palet tenang tanpa aturan warna benar atau salah.","mood-calm",2,false,["latar","objek-a","objek-b"]],
    ["color-mood-cozy","Suasana nyaman","Ciptakan suasana warna untuk ruang kecil yang nyaman.","🛋️","Pilih warna dinding, kursi, dan lampu.","mood-cozy",2,false,["dinding","kursi","lampu"]],
    ["color-mood-adventure","Suasana petualangan","Eksplorasi palet yang terasa penuh petualangan.","🧭","Warnai jalur, langit, dan penanda dengan ide bebas.","mood-adventure",3,false,["jalur","langit","penanda"]],
    ["color-mood-dreamy","Suasana mimpi","Ciptakan kombinasi warna yang terasa seperti mimpi versimu.","💭","Campur warna bebas pada awan, bintang, dan latar.","mood-dreamy",3,false,["awan","bintang","latar"]]
  ]),
  ...color("color.pack.material-surfaces","color-material-surfaces","color.material.exploration",[
    ["color-material-wood","Benda kayu","Eksplorasi beberapa warna pada permukaan bergaris seperti kayu.","🪵","Warnai bagian serat tanpa harus meniru kayu asli.","material-wood",2,true,["serat-a","serat-b","tepi"]],
    ["color-material-metal","Benda metal imajinatif","Coba warna terang dan gelap pada benda metal imajinatif.","⚙️","Pilih warna panel, kilau, dan bayangan versimu.","material-metal",2,false,["panel","kilau","bayangan"]],
    ["color-material-fabric","Kain berpola","Eksplorasi warna pada kain dengan tiga area pola.","🧵","Isi pola kain dengan kombinasi warna pilihanmu.","material-fabric",2,false,["pola-a","pola-b","dasar"]],
    ["color-material-stone","Batu warna-warni","Mainkan warna pada beberapa bidang batu.","🪨","Tidak harus abu-abu; buat batu fantasi versimu.","material-stone",2,false,["bidang-a","bidang-b","bidang-c"]],
    ["color-material-glass","Kaca imajinasi","Coba warna ringan atau kuat pada bidang seperti kaca.","🔷","Eksplorasi tiga panel transparan secara kreatif.","material-glass",3,false,["panel-a","panel-b","pantulan"]]
  ]),
  ...color("color.pack.story-scenes","color-story-scenes","color.story.scenes",[
    ["color-story-morning","Cerita pagi","Warnai adegan pagi sesuai suasana yang kamu bayangkan.","🌅","Pilih warna langit, rumah, dan jalan untuk awal cerita.","story-morning",2,true,["langit","rumah","jalan"]],
    ["color-story-rain-trip","Perjalanan hujan","Eksplorasi warna adegan seseorang berjalan saat hujan.","🌧️","Warnai payung, jas hujan, dan latar.","story-rain-trip",2,false,["payung","jas","latar"]],
    ["color-story-picnic","Piknik","Buat palet untuk selimut, makanan, dan taman.","🧺","Warnai adegan piknik dengan suasana versimu.","story-picnic",2,false,["selimut","keranjang","taman"]],
    ["color-story-night-camp","Kemah malam","Eksplorasi warna pada tenda, api, dan langit malam.","⛺","Buat suasana kemah malam dengan pilihan bebas.","story-night-camp",3,false,["tenda","api","langit"]],
    ["color-story-party","Pesta kecil","Ciptakan palet pesta untuk balon, kue, dan dekorasi.","🎉","Pilih kombinasi warna yang membuat pesta versimu hidup.","story-party",3,false,["balon","kue","dekorasi"]]
  ])
];

export const CREATIVE_BATCH14_WAVE_C: CreativeBatch14WaveDefinition = {
  wave:"C",
  stages:[
    {id:DRAWING_STAGE,subjectId:"drawing",title:"Ruang, Cerita & Imajinasi",subtitle:"Eksplorasi lapisan ruang, tekstur, keseimbangan visual, cerita, dan ide ciptaan sendiri.",emoji:"🖍️"},
    {id:COLOR_STAGE,subjectId:"color",title:"Suasana, Material & Cerita",subtitle:"Eksplorasi hubungan warna, kontras, suasana, material, dan adegan cerita tanpa jawaban tunggal.",emoji:"🎨"}
  ],
  lessons:[
    {id:"drawing-space-layers",subjectId:"drawing",pathId:"drawing-creative-studio",stageId:DRAWING_STAGE,title:"Ruang & Lapisan",objective:"Mengeksplorasi tumpang tindih, ukuran, dan posisi untuk membangun ruang visual.",ageMin:4,ageMax:7},
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
    {id:"drawing.space.layers",subjectId:"drawing",title:"Ruang dan lapisan",description:"Berlatih mengeksplorasi posisi, ukuran, dan tumpang tindih dalam gambar.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.texture.marks",subjectId:"drawing",title:"Tekstur dan goresan",description:"Berlatih memakai variasi goresan untuk kesan permukaan.",domain:"creative",ageMin:3,ageMax:7},
    {id:"drawing.symmetry.exploration",subjectId:"drawing",title:"Keseimbangan dua sisi",description:"Mengeksplorasi bentuk dua sisi tanpa klaim akurasi simetri.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.story.sequence",subjectId:"drawing",title:"Urutan cerita visual",description:"Berlatih menyampaikan perubahan sederhana melalui dua momen gambar.",domain:"creative",ageMin:4,ageMax:7},
    {id:"drawing.imagination.invention",subjectId:"drawing",title:"Sketsa imajinasi",description:"Menciptakan objek baru dengan menggabungkan bentuk dan ide.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.palette.neighbor",subjectId:"color",title:"Palet berdekatan",description:"Mengeksplorasi hubungan warna yang terasa selaras secara personal.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.palette.contrast",subjectId:"color",title:"Eksplorasi kontras",description:"Mengeksplorasi perbedaan warna kuat tanpa jawaban tunggal.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.palette.mood",subjectId:"color",title:"Palet suasana",description:"Mengeksplorasi asosiasi personal antara warna dan suasana.",domain:"creative",ageMin:3,ageMax:7},
    {id:"color.material.exploration",subjectId:"color",title:"Warna material",description:"Mengeksplorasi warna pada berbagai pola permukaan imajinatif.",domain:"creative",ageMin:4,ageMax:7},
    {id:"color.story.scenes",subjectId:"color",title:"Warna adegan cerita",description:"Menggunakan warna untuk membangun suasana cerita sederhana.",domain:"creative",ageMin:4,ageMax:7}
  ],
  activities:[...drawingActivities,...colorActivities]
};
