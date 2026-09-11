import type { LogicBatch12ActivitySeed, LogicBatch12WaveDefinition } from "./logicBatch12Authoring";

const STAGE_ID = "logic-mixed-reasoning-challenge";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,choices:string[],correctChoice:string,skillId:string,options:SeedOptions={}):LogicBatch12ActivitySeed{return{kind:"choice",id,packId,lessonId,title,description,emoji:options.emoji??"🧠",ageMin:options.ageMin??5,ageMax:7,difficulty:options.difficulty??3,requiredForStage:options.required??false,skillId,prompt,choices,correctChoice};}
function matching(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,skillId:string,pairs:Array<{left:string;right:string;pair:string}>,options:SeedOptions={}):LogicBatch12ActivitySeed{return{kind:"matching",id,packId,lessonId,title,description,emoji:options.emoji??"🧩",ageMin:options.ageMin??5,ageMax:7,difficulty:options.difficulty??3,requiredForStage:options.required??false,skillId,prompt,matchItems:pairs.flatMap(({left,right,pair})=>[{label:left,pair},{label:right,pair}])};}

const composedRules=[
choice("logic-compose-red-circle-to-star","logic.pack.composed-rules","logic-composed-rules","Dua aturan berurutan","Menerapkan dua aturan sederhana secara berurutan.","Aturan 1: merah menjadi lingkaran. Aturan 2: lingkaran menjadi bintang. Jika mulai dari merah, hasil akhir apa?",["bintang ★","lingkaran ●","kotak ■"],"bintang ★","logic.rule.composition.basic",{required:true}),
choice("logic-compose-small-left-then-up","logic.pack.composed-rules","logic-composed-rules","Kecil, kiri, lalu atas","Menggabungkan aturan ukuran dan arah satu demi satu.","Aturan: benda kecil bergerak ke kiri, lalu panah kiri berputar ke atas. Arah akhirnya?",["atas ↑","kiri ←","kanan →"],"atas ↑","logic.rule.composition.basic"),
choice("logic-compose-two-to-blue","logic.pack.composed-rules","logic-composed-rules","Dua menjadi biru","Mengikuti pemetaan jumlah lalu warna.","Aturan: dua titik berubah jadi kotak; kotak berubah jadi biru. Hasil akhir dari ●●?",["biru","kotak","dua titik"],"biru","logic.rule.composition.basic"),
choice("logic-compose-triangle-turn-right","logic.pack.composed-rules","logic-composed-rules","Segitiga berputar","Menerapkan identifikasi bentuk lalu rotasi arah.","Aturan: segitiga berarti panah atas; lalu panah diputar ke kanan. Arah akhirnya?",["kanan →","atas ↑","bawah ↓"],"kanan →","logic.rule.composition.basic"),
choice("logic-compose-swap-then-grow","logic.pack.composed-rules","logic-composed-rules","Tukar lalu tambah","Mengikuti dua transformasi pada urutan simbol.","Mulai: ● ▲. Aturan 1 tukar posisi. Aturan 2 tambahkan satu ● di akhir. Mana hasilnya?",["▲ ● ●","● ▲ ●","▲ ▲ ●"],"▲ ● ●","logic.rule.composition.basic")
];

const setReasoning=[
choice("logic-set-both-red-round","logic.pack.set-reasoning","logic-set-reasoning","Masuk dua kelompok","Menentukan anggota yang memenuhi dua kelompok sekaligus.","Kelompok A = benda merah. Kelompok B = benda bulat. Mana yang masuk A dan B?",["lingkaran merah","kotak merah","lingkaran biru"],"lingkaran merah","logic.set.relation.basic",{required:true}),
choice("logic-set-animal-not-bird","logic.pack.set-reasoning","logic-set-reasoning","Hewan tetapi bukan burung","Memilih anggota kategori dengan pengecualian subkategori.","Pilih hewan yang bukan burung.",["kucing","elang","merpati"],"kucing","logic.set.relation.basic"),
choice("logic-set-shape-not-square","logic.pack.set-reasoning","logic-set-reasoning","Bentuk tetapi bukan kotak","Menggunakan kategori umum dan pengecualian bentuk.","Semua pilihan adalah bentuk. Mana yang bukan kotak?",["segitiga ▲","kotak biru 🟦","kotak merah 🟥"],"segitiga ▲","logic.set.relation.basic"),
choice("logic-set-only-blue-triangle","logic.pack.set-reasoning","logic-set-reasoning","Irisan biru dan segitiga","Menemukan satu anggota pada irisan dua ciri.","Mana yang sekaligus biru dan segitiga?",["segitiga biru","lingkaran biru","segitiga merah"],"segitiga biru","logic.set.relation.basic"),
choice("logic-set-outside-round-red","logic.pack.set-reasoning","logic-set-reasoning","Di luar dua kelompok","Menentukan objek yang tidak memenuhi dua kategori target.","Kelompok yang dicari adalah merah atau bulat. Mana yang tidak termasuk keduanya?",["kotak biru","lingkaran biru","kotak merah"],"kotak biru","logic.set.relation.basic")
];

const transitive=[
choice("logic-transitive-height-abc","logic.pack.transitive-comparison","logic-transitive-comparison","Siapa paling tinggi","Menarik kesimpulan dari dua perbandingan tinggi.","A lebih tinggi dari B. B lebih tinggi dari C. Siapa paling tinggi?",["A","B","C"],"A","logic.comparison.transitive.basic",{required:true}),
choice("logic-transitive-shortest-xyz","logic.pack.transitive-comparison","logic-transitive-comparison","Siapa paling pendek","Menarik kesimpulan urutan dari hubungan lebih panjang.","X lebih panjang dari Y. Y lebih panjang dari Z. Siapa paling pendek?",["Z","Y","X"],"Z","logic.comparison.transitive.basic"),
choice("logic-transitive-most-dots","logic.pack.transitive-comparison","logic-transitive-comparison","Jumlah paling banyak","Menggunakan hubungan jumlah bertingkat.","Kotak P punya lebih banyak titik dari Q. Q lebih banyak dari R. Kotak mana paling banyak?",["P","Q","R"],"P","logic.comparison.transitive.basic"),
choice("logic-transitive-lightest","logic.pack.transitive-comparison","logic-transitive-comparison","Yang paling ringan","Menentukan ekstrem dari dua hubungan berat sederhana.","Bola A lebih berat dari B. Bola B lebih berat dari C. Mana yang paling ringan?",["C","B","A"],"C","logic.comparison.transitive.basic"),
choice("logic-transitive-middle-order","logic.pack.transitive-comparison","logic-transitive-comparison","Yang berada di tengah","Menentukan anggota tengah pada tiga tingkat.","Merah lebih besar dari kuning. Kuning lebih besar dari hijau. Mana ukuran tengah?",["kuning","merah","hijau"],"kuning","logic.comparison.transitive.basic")
];

const spatialTransforms=[
choice("logic-spatial-halfturn-up","logic.pack.spatial-transform","logic-spatial-transform","Putar setengah lingkaran","Menentukan arah setelah rotasi 180 derajat.","Panah ↑ diputar setengah lingkaran. Jadi mengarah ke mana?",["bawah ↓","kanan →","kiri ←"],"bawah ↓","logic.spatial.transform.basic",{required:true}),
choice("logic-spatial-quarterturn-left","logic.pack.spatial-transform","logic-spatial-transform","Putar seperempat ke kiri","Menentukan arah setelah rotasi 90 derajat ke kiri.","Panah ↑ diputar seperempat putaran ke kiri. Hasilnya?",["kiri ←","kanan →","bawah ↓"],"kiri ←","logic.spatial.transform.basic"),
choice("logic-spatial-quarterturn-right-down","logic.pack.spatial-transform","logic-spatial-transform","Dari bawah ke kiri","Menentukan arah setelah rotasi 90 derajat ke kanan.","Panah ↓ diputar seperempat putaran ke kanan. Hasilnya?",["kiri ←","kanan →","atas ↑"],"kiri ←","logic.spatial.transform.basic"),
choice("logic-spatial-two-right-turns","logic.pack.spatial-transform","logic-spatial-transform","Dua kali belok kanan","Menggabungkan dua rotasi seperempat putaran.","Mulai menghadap kiri ←. Belok kanan dua kali. Arah akhir?",["kanan →","atas ↑","bawah ↓"],"kanan →","logic.spatial.transform.basic"),
choice("logic-spatial-mirror-left-right","logic.pack.spatial-transform","logic-spatial-transform","Cermin kiri-kanan","Menentukan perubahan arah sederhana pada cermin horizontal.","Panah → dicerminkan kiri-kanan. Mana hasilnya?",["kiri ←","atas ↑","bawah ↓"],"kiri ←","logic.spatial.transform.basic")
];

const relationalReview=[
matching("logic-review-opposites","logic.pack.relational-review","logic-relational-review","Pasangan berlawanan","Mencocokkan relasi kebalikan yang familiar.","Pasangkan setiap konsep dengan lawannya.","logic.relation.mixed.review",[{left:"atas",right:"bawah",pair:"vertical"},{left:"kiri",right:"kanan",pair:"horizontal"},{left:"besar",right:"kecil",pair:"size"}],{required:true}),
matching("logic-review-sequence-symbols","logic.pack.relational-review","logic-relational-review","Simbol dan berikutnya","Mencocokkan elemen dengan penerus pada aturan yang ditampilkan.","Aturan urutan: A→B→C→D. Pasangkan elemen dengan yang tepat sesudahnya.","logic.relation.mixed.review",[{left:"A",right:"B",pair:"ab"},{left:"B",right:"C",pair:"bc"},{left:"C",right:"D",pair:"cd"}]),
matching("logic-review-count-groups","logic.pack.relational-review","logic-relational-review","Jumlah dan kelompok","Mencocokkan angka dengan representasi jumlah yang berbeda.","Pasangkan angka dengan kelompok yang jumlahnya sama.","logic.relation.mixed.review",[{left:"2",right:"★★",pair:"two"},{left:"3",right:"●●●",pair:"three"},{left:"4",right:"▲▲▲▲",pair:"four"}]),
matching("logic-review-category-example","logic.pack.relational-review","logic-relational-review","Kategori dan contoh","Mencocokkan kategori umum dengan contoh yang jelas.","Pasangkan kategori dengan satu contohnya.","logic.relation.mixed.review",[{left:"hewan",right:"kucing",pair:"animal"},{left:"buah",right:"apel",pair:"fruit"},{left:"kendaraan",right:"sepeda",pair:"vehicle"}]),
matching("logic-review-relation-analogy","logic.pack.relational-review","logic-relational-review","Hubungan campuran","Mencocokkan benda berdasarkan hubungan fungsi atau tempat.","Pasangkan setiap benda dengan pasangan yang paling berhubungan.","logic.relation.mixed.review",[{left:"kunci",right:"pintu",pair:"key"},{left:"sendok",right:"mangkuk",pair:"spoon"},{left:"bantal",right:"tempat tidur",pair:"pillow"}])
];

export const LOGIC_BATCH12_WAVE_D:LogicBatch12WaveDefinition={wave:"D",stage:{id:STAGE_ID,subjectId:"logic",title:"Tantangan Nalar Campuran",subtitle:"Gabungkan aturan, kelompok, perbandingan, arah, dan hubungan untuk menutup fondasi Logika.",emoji:"🏁"},lessons:[
{id:"logic-composed-rules",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Gabungkan dua aturan",objective:"Menerapkan dua aturan sederhana secara berurutan tanpa kehilangan langkah.",ageMin:5,ageMax:7},
{id:"logic-set-reasoning",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Kelompok dan irisan",objective:"Menentukan anggota kategori, irisan dua ciri, dan pengecualian sederhana.",ageMin:5,ageMax:7},
{id:"logic-transitive-comparison",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Bandingkan bertingkat",objective:"Menarik kesimpulan dari dua hubungan perbandingan yang berurutan.",ageMin:5,ageMax:7},
{id:"logic-spatial-transform",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Putar dan cerminkan arah",objective:"Menentukan arah setelah rotasi dan pencerminan sederhana.",ageMin:5,ageMax:7},
{id:"logic-relational-review",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Review relasi campuran",objective:"Mengintegrasikan hubungan lawan, urutan, jumlah, kategori, dan fungsi.",ageMin:5,ageMax:7}
],packs:[
{id:"logic.pack.composed-rules",title:"Composed Rules",lessonId:"logic-composed-rules",ageMin:5,ageMax:7},
{id:"logic.pack.set-reasoning",title:"Set Reasoning",lessonId:"logic-set-reasoning",ageMin:5,ageMax:7},
{id:"logic.pack.transitive-comparison",title:"Transitive Comparison",lessonId:"logic-transitive-comparison",ageMin:5,ageMax:7},
{id:"logic.pack.spatial-transform",title:"Spatial Transform",lessonId:"logic-spatial-transform",ageMin:5,ageMax:7},
{id:"logic.pack.relational-review",title:"Mixed Relational Review",lessonId:"logic-relational-review",ageMin:5,ageMax:7}
],skills:[
{id:"logic.rule.composition.basic",subjectId:"logic",title:"Komposisi aturan dasar",description:"Menerapkan dua aturan sederhana secara berurutan.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.set.relation.basic",subjectId:"logic",title:"Relasi himpunan dasar",description:"Menentukan kategori, irisan atribut, dan pengecualian sederhana.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.comparison.transitive.basic",subjectId:"logic",title:"Perbandingan transitif dasar",description:"Menarik kesimpulan dari dua hubungan perbandingan bertingkat.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.spatial.transform.basic",subjectId:"logic",title:"Transformasi spasial dasar",description:"Menentukan arah setelah rotasi dan pencerminan sederhana.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.relation.mixed.review",subjectId:"logic",title:"Review relasi campuran",description:"Mengintegrasikan relasi lawan, urutan, jumlah, kategori, dan fungsi.",domain:"reasoning",ageMin:5,ageMax:7}
],activities:[...composedRules,...setReasoning,...transitive,...spatialTransforms,...relationalReview]};
