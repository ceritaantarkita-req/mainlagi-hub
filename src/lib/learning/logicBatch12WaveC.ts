import type { LogicBatch12ActivitySeed, LogicBatch12WaveDefinition } from "./logicBatch12Authoring";

const STAGE_ID = "logic-conditional-analogy-inference";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,choices:string[],correctChoice:string,skillId:string,options:SeedOptions={}):LogicBatch12ActivitySeed{return{kind:"choice",id,packId,lessonId,title,description,emoji:options.emoji??"🧠",ageMin:options.ageMin??5,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,choices,correctChoice};}
function matching(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,skillId:string,pairs:Array<{left:string;right:string;pair:string}>,options:SeedOptions={}):LogicBatch12ActivitySeed{return{kind:"matching",id,packId,lessonId,title,description,emoji:options.emoji??"🧩",ageMin:options.ageMin??5,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,matchItems:pairs.flatMap(({left,right,pair})=>[{label:left,pair},{label:right,pair}])};}

const conditional=[
choice("logic-if-red-then-circle","logic.pack.conditional-rules","logic-conditional-rules","Jika merah pilih lingkaran","Mengikuti satu aturan kondisi berdasarkan warna.","Aturannya: jika merah, pilih lingkaran. Mana yang benar?",["🔴 lingkaran","🔴 segitiga","🔵 lingkaran"],"🔴 lingkaran","logic.conditional.rule.basic",{required:true}),
choice("logic-if-two-then-star","logic.pack.conditional-rules","logic-conditional-rules","Jika dua pilih bintang","Mengikuti aturan kondisi berdasarkan jumlah.","Aturannya: jika jumlahnya 2, pilih bintang. Mana yang cocok?",["★★","●●","★★★"],"★★","logic.conditional.rule.basic"),
choice("logic-rule-small-goes-left","logic.pack.conditional-rules","logic-conditional-rules","Yang kecil ke kiri","Memilih susunan yang mematuhi aturan posisi.","Aturannya: benda kecil harus di kiri benda besar. Mana susunan yang benar?",["●  ⬤","⬤  ●","⬤  ⬤"],"●  ⬤","logic.conditional.rule.basic"),
choice("logic-rule-up-means-one","logic.pack.conditional-rules","logic-conditional-rules","Panah atas berarti satu","Menerapkan pemetaan simbol ke jumlah.","Aturannya: ↑ berarti satu titik dan → berarti dua titik. Apa pasangan untuk → ?",["●●","●","●●●"],"●●","logic.conditional.rule.basic",{difficulty:3}),
choice("logic-rule-switch-shape","logic.pack.conditional-rules","logic-conditional-rules","Ubah bentuk sesuai aturan","Menerapkan aturan transformasi satu langkah.","Aturannya: lingkaran berubah jadi segitiga. Jika mulai dari ●, hasilnya?",["▲","■","●"],"▲","logic.conditional.rule.basic",{difficulty:3})
];

const classification=[
choice("logic-classify-red-round","logic.pack.multi-classification","logic-multi-classification","Merah dan bulat","Memilih objek yang memenuhi dua ciri sekaligus.","Mana yang sekaligus merah dan bulat?",["🔴","🟥","🔵"],"🔴","logic.classification.multi_attribute",{required:true}),
choice("logic-classify-blue-not-round","logic.pack.multi-classification","logic-multi-classification","Biru tapi bukan bulat","Menggabungkan satu ciri positif dan satu pengecualian.","Mana yang biru tetapi bukan bulat?",["🟦","🔵","🟥"],"🟦","logic.classification.multi_attribute"),
choice("logic-classify-two-red-items","logic.pack.multi-classification","logic-multi-classification","Dua benda merah","Memilih kelompok berdasarkan warna dan jumlah.","Mana kelompok yang punya tepat dua benda merah?",["🔴🔴","🔴🔴🔴","🔵🔵"],"🔴🔴","logic.classification.multi_attribute"),
choice("logic-classify-arrow-not-left","logic.pack.multi-classification","logic-multi-classification","Panah bukan ke kiri","Memilih berdasarkan kategori dengan pengecualian arah.","Mana panah yang tidak mengarah ke kiri?",["→","←","←"],"→","logic.classification.multi_attribute"),
choice("logic-classify-same-shape-different-color","logic.pack.multi-classification","logic-multi-classification","Bentuk sama warna beda","Mencari pasangan yang bentuknya sama tetapi warnanya berbeda.","Pasangan mana yang bentuknya sama tetapi warnanya berbeda?",["🔴 🔵","🔴 🟥","🟥 🔵"],"🔴 🔵","logic.classification.multi_attribute",{difficulty:3})
];

const analogies=[
matching("logic-analogy-young-adult","logic.pack.analogies","logic-analogies","Anak dan dewasa","Mencocokkan hubungan tahap muda ke dewasa pada contoh familiar.","Pasangkan yang muda dengan bentuk dewasanya.","logic.analogy.relation.basic",[{left:"anak kucing",right:"kucing",pair:"cat"},{left:"anak ayam",right:"ayam",pair:"chicken"},{left:"bayi",right:"orang dewasa",pair:"human"}],{required:true}),
matching("logic-analogy-container-content","logic.pack.analogies","logic-analogies","Wadah dan isinya","Mencocokkan benda dengan isi yang lazim.","Pasangkan wadah dengan isi yang paling sesuai.","logic.analogy.relation.basic",[{left:"gelas",right:"air",pair:"glass"},{left:"mangkuk",right:"sup",pair:"bowl"},{left:"tas sekolah",right:"buku",pair:"bag"}]),
matching("logic-analogy-place-object","logic.pack.analogies","logic-analogies","Tempat dan benda","Mencocokkan tempat dengan benda yang umum ditemukan di sana.","Pasangkan tempat dengan benda yang paling cocok.","logic.analogy.relation.basic",[{left:"dapur",right:"panci",pair:"kitchen"},{left:"kelas",right:"papan tulis",pair:"class"},{left:"kamar tidur",right:"bantal",pair:"bedroom"}]),
matching("logic-analogy-animal-home","logic.pack.analogies","logic-analogies","Hewan dan tempat tinggal","Mencocokkan hewan dengan tempat tinggal sederhananya.","Pasangkan hewan dengan tempat tinggalnya.","logic.analogy.relation.basic",[{left:"burung",right:"sarang",pair:"bird"},{left:"ikan",right:"air",pair:"fish"},{left:"lebah",right:"sarang lebah",pair:"bee"}]),
matching("logic-analogy-action-result","logic.pack.analogies","logic-analogies","Tindakan dan hasil","Mencocokkan tindakan sederhana dengan hasil langsungnya.","Pasangkan tindakan dengan hasil yang paling masuk akal.","logic.analogy.relation.basic",[{left:"memotong kertas",right:"kertas terbagi",pair:"cut"},{left:"menyiram tanaman",right:"tanah basah",pair:"water"},{left:"menyalakan lampu",right:"ruangan terang",pair:"light"}],{difficulty:3})
];

const ordering=[
choice("logic-order-first-after-start","logic.pack.relative-ordering","logic-relative-ordering","Siapa setelah mulai","Menentukan posisi langsung setelah elemen acuan.","Urutannya: A → B → C → D. Siapa tepat setelah B?",["C","A","D"],"C","logic.order.relative.basic",{required:true}),
choice("logic-order-before-d","logic.pack.relative-ordering","logic-relative-ordering","Tepat sebelum D","Menentukan posisi langsung sebelum elemen acuan.","Urutannya: A → B → C → D. Siapa tepat sebelum D?",["C","B","A"],"C","logic.order.relative.basic"),
choice("logic-order-between-blue-green","logic.pack.relative-ordering","logic-relative-ordering","Di antara biru dan hijau","Menentukan elemen yang berada di antara dua acuan.","Urutannya: merah → biru → kuning → hijau. Warna apa di antara biru dan hijau?",["kuning","merah","biru"],"kuning","logic.order.relative.basic"),
choice("logic-order-third-symbol","logic.pack.relative-ordering","logic-relative-ordering","Posisi ketiga","Menentukan elemen pada ordinal sederhana.","Urutan: ★, ●, ▲, ■. Mana yang berada di posisi ketiga?",["▲","●","■"],"▲","logic.order.relative.basic"),
choice("logic-order-two-steps-after","logic.pack.relative-ordering","logic-relative-ordering","Dua langkah setelah","Menentukan posisi dengan lompatan dua langkah.","Urutan: 1 → 2 → 3 → 4 → 5. Dua langkah setelah 2 adalah?",["4","3","5"],"4","logic.order.relative.basic",{difficulty:3})
];

const inference=[
choice("logic-infer-not-red","logic.pack.elimination-inference","logic-elimination-inference","Bukan yang merah","Mengeliminasi pilihan berdasarkan satu informasi negatif.","Pilih yang bukan merah.",["🔵","🔴","🔴"],"🔵","logic.inference.elimination.basic",{required:true}),
choice("logic-infer-only-triangle","logic.pack.elimination-inference","logic-elimination-inference","Satu-satunya segitiga","Menemukan satu pilihan yang memenuhi kategori target.","Hanya satu pilihan berbentuk segitiga. Mana itu?",["▲","●","■"],"▲","logic.inference.elimination.basic"),
choice("logic-infer-not-largest","logic.pack.elimination-inference","logic-elimination-inference","Bukan yang terbesar","Menggunakan pengecualian ukuran untuk memilih kandidat.","Mana yang bukan yang terbesar?",["●","⬤","⬤"],"●","logic.inference.elimination.basic"),
choice("logic-infer-common-feature","logic.pack.elimination-inference","logic-elimination-inference","Ciri yang sama","Menentukan ciri bersama dari beberapa contoh.","Contoh: 🔴 dan 🔵. Ciri apa yang sama?",["keduanya bulat","keduanya merah","keduanya kotak"],"keduanya bulat","logic.inference.elimination.basic",{difficulty:3}),
choice("logic-infer-missing-member","logic.pack.elimination-inference","logic-elimination-inference","Anggota yang belum ada","Menentukan anggota kategori yang hilang dari set kecil.","Set arah harus punya ↑ → ↓ ←. Yang terlihat ↑ → ↓. Mana yang belum ada?",["←","↑","→"],"←","logic.inference.elimination.basic",{difficulty:3})
];

export const LOGIC_BATCH12_WAVE_C:LogicBatch12WaveDefinition={wave:"C",stage:{id:STAGE_ID,subjectId:"logic",title:"Aturan, Analogi & Inferensi",subtitle:"Ikuti aturan kondisi, gabungkan ciri, pahami hubungan, urutan, dan eliminasi sederhana.",emoji:"🔎"},lessons:[
{id:"logic-conditional-rules",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Aturan kondisi",objective:"Mengikuti aturan jika-maka dan transformasi satu langkah sederhana.",ageMin:5,ageMax:7},
{id:"logic-multi-classification",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Klasifikasi dua ciri",objective:"Memilih objek berdasarkan dua atribut atau satu atribut dengan pengecualian.",ageMin:5,ageMax:7},
{id:"logic-analogies",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Analogi sehari-hari",objective:"Mencocokkan pasangan berdasarkan hubungan yang setara dan familiar.",ageMin:5,ageMax:7},
{id:"logic-relative-ordering",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Urutan relatif",objective:"Menentukan sebelum, sesudah, di antara, posisi, dan lompatan sederhana.",ageMin:5,ageMax:7},
{id:"logic-elimination-inference",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Eliminasi dan inferensi",objective:"Menyisihkan pilihan dan menarik kesimpulan langsung dari ciri yang terlihat.",ageMin:5,ageMax:7}
],packs:[
{id:"logic.pack.conditional-rules",title:"Conditional Rules",lessonId:"logic-conditional-rules",ageMin:5,ageMax:7},
{id:"logic.pack.multi-classification",title:"Multi Attribute Classification",lessonId:"logic-multi-classification",ageMin:5,ageMax:7},
{id:"logic.pack.analogies",title:"Everyday Analogies",lessonId:"logic-analogies",ageMin:5,ageMax:7},
{id:"logic.pack.relative-ordering",title:"Relative Ordering",lessonId:"logic-relative-ordering",ageMin:5,ageMax:7},
{id:"logic.pack.elimination-inference",title:"Elimination and Inference",lessonId:"logic-elimination-inference",ageMin:5,ageMax:7}
],skills:[
{id:"logic.conditional.rule.basic",subjectId:"logic",title:"Aturan kondisi dasar",description:"Mengikuti aturan kondisi dan transformasi satu langkah.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.classification.multi_attribute",subjectId:"logic",title:"Klasifikasi multi-ciri",description:"Memilih berdasarkan gabungan dua atribut atau pengecualian sederhana.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.analogy.relation.basic",subjectId:"logic",title:"Analogi relasional dasar",description:"Mencocokkan pasangan berdasarkan hubungan yang setara dan familiar.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.order.relative.basic",subjectId:"logic",title:"Urutan relatif dasar",description:"Menentukan sebelum, sesudah, di antara, ordinal, dan lompatan sederhana.",domain:"reasoning",ageMin:5,ageMax:7},
{id:"logic.inference.elimination.basic",subjectId:"logic",title:"Inferensi eliminasi dasar",description:"Menyisihkan pilihan dan menarik kesimpulan langsung dari informasi sederhana.",domain:"reasoning",ageMin:5,ageMax:7}
],activities:[...conditional,...classification,...analogies,...ordering,...inference]};
