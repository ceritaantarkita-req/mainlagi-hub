import type { LogicBatch12ActivitySeed, LogicBatch12WaveDefinition } from "./logicBatch12Authoring";

const STAGE_ID = "logic-patterns-sequences-relations";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,choices:string[],correctChoice:string,skillId:string,options:SeedOptions={}):LogicBatch12ActivitySeed{return{kind:"choice",id,packId,lessonId,title,description,emoji:options.emoji??"🧠",ageMin:options.ageMin??4,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,choices,correctChoice};}
function matching(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,skillId:string,pairs:Array<{left:string;right:string;pair:string}>,options:SeedOptions={}):LogicBatch12ActivitySeed{return{kind:"matching",id,packId,lessonId,title,description,emoji:options.emoji??"🧩",ageMin:options.ageMin??4,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,matchItems:pairs.flatMap(({left,right,pair})=>[{label:left,pair},{label:right,pair}])};}

const patterns=[
choice("logic-pattern-aab-stars","logic.pack.patterns-intermediate","logic-patterns-intermediate","Pola dua bintang satu lingkaran","Melanjutkan pola tiga langkah dengan dua simbol sama lalu satu berbeda.","★ ★ ○  ★ ★ ○  ★ ★ ... selanjutnya?",["○","★","▲"],"○","logic.pattern.repeat.intermediate",{required:true}),
choice("logic-pattern-abb-shapes","logic.pack.patterns-intermediate","logic-patterns-intermediate","Pola satu bulat dua segitiga","Melanjutkan pola A-B-B yang berulang.","● ▲ ▲  ● ▲ ▲  ● ... selanjutnya?",["▲","●","■"],"▲","logic.pattern.repeat.intermediate"),
choice("logic-pattern-abc-shapes","logic.pack.patterns-intermediate","logic-patterns-intermediate","Pola tiga bentuk","Melanjutkan siklus tiga bentuk berbeda secara berurutan.","● ▲ ■  ● ▲ ■  ● ... selanjutnya?",["▲","■","●"],"▲","logic.pattern.repeat.intermediate"),
choice("logic-pattern-paired-blocks","logic.pack.patterns-intermediate","logic-patterns-intermediate","Pola dua-dua","Mengenali pengulangan kelompok dua simbol yang sama.","▲ ▲  ● ●  ▲ ▲ ... kelompok berikutnya?",["● ●","▲ ●","■ ■"],"● ●","logic.pattern.repeat.intermediate"),
choice("logic-pattern-abba","logic.pack.patterns-intermediate","logic-patterns-intermediate","Pola cermin empat langkah","Melanjutkan pola A-B-B-A yang berulang.","● ▲ ▲ ●  ● ▲ ▲ ... selanjutnya?",["●","▲","■"],"●","logic.pattern.repeat.intermediate",{difficulty:3,ageMin:5})
];

const sequences=[
choice("logic-sequence-grow-dots","logic.pack.sequences-intermediate","logic-sequences-intermediate","Urutan bertambah","Menentukan langkah berikut saat jumlah simbol bertambah satu.","● → ●● → ●●● → ?",["●●●●","●●","●"],"●●●●","logic.sequence.position.intermediate",{required:true}),
choice("logic-sequence-shrink-stars","logic.pack.sequences-intermediate","logic-sequences-intermediate","Urutan berkurang","Menentukan langkah berikut saat jumlah simbol berkurang satu.","★★★★ → ★★★ → ★★ → ?",["★","★★★","★★★★"],"★","logic.sequence.position.intermediate"),
choice("logic-sequence-clockwise-full","logic.pack.sequences-intermediate","logic-sequences-intermediate","Putaran searah jarum jam","Mengikuti urutan empat arah yang berputar searah jarum jam.","↑ → ↓ ← ↑ → ... berikutnya?",["↓","←","↑"],"↓","logic.sequence.position.intermediate"),
choice("logic-sequence-counterclockwise","logic.pack.sequences-intermediate","logic-sequences-intermediate","Putaran berlawanan arah","Mengikuti urutan arah yang berputar berlawanan jarum jam.","↑ ← ↓ → ↑ ... berikutnya?",["←","→","↓"],"←","logic.sequence.position.intermediate",{difficulty:3,ageMin:5}),
choice("logic-sequence-shape-cycle-offset","logic.pack.sequences-intermediate","logic-sequences-intermediate","Cari posisi berikut dalam siklus","Meneruskan siklus bentuk dari posisi tengah rangkaian.","▲ ■ ● ▲ ■ ... berikutnya?",["●","▲","■"],"●","logic.sequence.position.intermediate")
];

const associations=[
matching("logic-associate-object-use","logic.pack.associations-intermediate","logic-associations-intermediate","Benda dan kegunaannya","Mencocokkan benda dengan konteks penggunaan sehari-hari yang paling dekat.","Pasangkan benda dengan yang biasa digunakan bersamanya.","logic.association.semantic.intermediate",[{left:"☂️",right:"🌧️",pair:"rain"},{left:"🥄",right:"🥣",pair:"bowl"},{left:"👟",right:"🦶",pair:"foot"}],{required:true}),
matching("logic-associate-part-whole","logic.pack.associations-intermediate","logic-associations-intermediate","Bagian dan bendanya","Mencocokkan bagian sederhana dengan benda utuhnya.","Pasangkan bagian dengan benda utuh yang sesuai.","logic.association.semantic.intermediate",[{left:"roda",right:"mobil",pair:"car"},{left:"halaman",right:"buku",pair:"book"},{left:"pintu",right:"rumah",pair:"house"}]),
matching("logic-associate-tool-action","logic.pack.associations-intermediate","logic-associations-intermediate","Alat dan tindakan","Mencocokkan alat sederhana dengan tindakan utamanya.","Pasangkan alat dengan tindakan yang sesuai.","logic.association.semantic.intermediate",[{left:"gunting",right:"memotong",pair:"cut"},{left:"kunci",right:"membuka",pair:"unlock"},{left:"sikat",right:"menyikat",pair:"brush"}]),
matching("logic-associate-symbol-direction","logic.pack.associations-intermediate","logic-associations-intermediate","Arah dan pasangan lawannya","Mencocokkan setiap arah dengan arah yang berlawanan.","Pasangkan panah dengan arah lawannya.","logic.association.semantic.intermediate",[{left:"↑",right:"↓",pair:"vertical"},{left:"←",right:"→",pair:"horizontal"},{left:"↖",right:"↘",pair:"diagonal"}],{difficulty:3,ageMin:5})
];

const comparisons=[
choice("logic-compare-longer-bars","logic.pack.comparisons-intermediate","logic-comparisons-intermediate","Garis paling panjang","Membandingkan tiga panjang visual dengan selisih yang lebih rapat.","Mana garis yang paling panjang?",["━━","━━━━","━━━"],"━━━━","logic.comparison.relation.intermediate",{required:true}),
choice("logic-compare-shorter-bars","logic.pack.comparisons-intermediate","logic-comparisons-intermediate","Garis paling pendek","Membandingkan tiga panjang visual dan memilih yang terpendek.","Mana garis yang paling pendek?",["━━━━","━","━━"],"━","logic.comparison.relation.intermediate"),
choice("logic-compare-most-triangles","logic.pack.comparisons-intermediate","logic-comparisons-intermediate","Segitiga paling banyak","Membandingkan jumlah dalam tiga kelompok yang memakai simbol sama.","Kelompok mana yang paling banyak?",["▲▲","▲▲▲▲","▲▲▲"],"▲▲▲▲","logic.comparison.relation.intermediate"),
choice("logic-compare-fewest-circles","logic.pack.comparisons-intermediate","logic-comparisons-intermediate","Lingkaran paling sedikit","Membandingkan jumlah dalam tiga kelompok dan memilih yang paling sedikit.","Kelompok mana yang paling sedikit?",["●●●","●●","●●●●"],"●●","logic.comparison.relation.intermediate"),
choice("logic-compare-equal-four","logic.pack.comparisons-intermediate","logic-comparisons-intermediate","Cari empat yang setara","Mencari kelompok berbeda yang jumlah anggotanya sama dengan contoh empat.","Mana yang sama banyak dengan ■■■■?",["★★★★","★★★","★★★★★"],"★★★★","logic.comparison.relation.intermediate")
];

const spatial=[
choice("logic-spatial-star-left-circle","logic.pack.spatial-relations","logic-spatial-relations","Bintang di kiri lingkaran","Memilih susunan yang memenuhi relasi kiri-kanan sederhana.","Mana yang menunjukkan bintang di kiri lingkaran?",["★ ○","○ ★","★ ★"],"★ ○","logic.spatial.relation.basic",{required:true}),
choice("logic-spatial-circle-right-triangle","logic.pack.spatial-relations","logic-spatial-relations","Lingkaran di kanan segitiga","Memilih susunan berdasarkan posisi objek di kanan objek lain.","Mana yang menunjukkan lingkaran di kanan segitiga?",["▲ ○","○ ▲","▲ ▲"],"▲ ○","logic.spatial.relation.basic"),
choice("logic-spatial-circle-between-stars","logic.pack.spatial-relations","logic-spatial-relations","Lingkaran di tengah","Mengenali relasi di antara dua objek yang sama.","Mana yang menaruh lingkaran di antara dua bintang?",["★ ○ ★","○ ★ ★","★ ★ ○"],"★ ○ ★","logic.spatial.relation.basic"),
choice("logic-spatial-turn-right-from-up","logic.pack.spatial-relations","logic-spatial-relations","Belok kanan dari atas","Menentukan arah setelah satu belokan kanan.","Jika menghadap ↑ lalu belok kanan, menghadap ke mana?",["→","←","↓"],"→","logic.spatial.relation.basic",{difficulty:3,ageMin:5}),
choice("logic-spatial-turn-left-from-right","logic.pack.spatial-relations","logic-spatial-relations","Belok kiri dari kanan","Menentukan arah setelah satu belokan kiri.","Jika menghadap → lalu belok kiri, menghadap ke mana?",["↑","↓","←"],"↑","logic.spatial.relation.basic",{difficulty:3,ageMin:5}),
choice("logic-spatial-opposite-left","logic.pack.spatial-relations","logic-spatial-relations","Arah berlawanan","Menentukan arah yang tepat berlawanan dari panah acuan.","Arah apa yang berlawanan dengan ← ?",["→","↑","↓"],"→","logic.spatial.relation.basic")
];

export const LOGIC_BATCH12_WAVE_B:LogicBatch12WaveDefinition={wave:"B",stage:{id:STAGE_ID,subjectId:"logic",title:"Pola, Urutan & Relasi",subtitle:"Latih pola berulang, urutan perubahan, asosiasi, perbandingan, dan posisi sederhana.",emoji:"🧩"},lessons:[
{id:"logic-patterns-intermediate",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Pola berulang",objective:"Meneruskan pola dua sampai empat langkah berdasarkan aturan pengulangan.",ageMin:4,ageMax:7},
{id:"logic-sequences-intermediate",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Urutan perubahan",objective:"Meneruskan urutan berdasarkan pertambahan, pengurangan, putaran, atau siklus bentuk.",ageMin:4,ageMax:7},
{id:"logic-associations-intermediate",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Hubungan pasangan",objective:"Mencocokkan objek, bagian, alat, dan arah berdasarkan hubungan yang masuk akal.",ageMin:4,ageMax:7},
{id:"logic-comparisons-intermediate",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Bandingkan dengan teliti",objective:"Membandingkan panjang dan jumlah melalui representasi visual sederhana.",ageMin:4,ageMax:7},
{id:"logic-spatial-relations",subjectId:"logic",pathId:"logic-thinking-foundations",stageId:STAGE_ID,title:"Posisi dan arah",objective:"Menentukan kiri, kanan, tengah, belokan, dan arah berlawanan.",ageMin:4,ageMax:7}
],packs:[
{id:"logic.pack.patterns-intermediate",title:"Intermediate Repeating Patterns",lessonId:"logic-patterns-intermediate",ageMin:4,ageMax:7},
{id:"logic.pack.sequences-intermediate",title:"Intermediate Sequences",lessonId:"logic-sequences-intermediate",ageMin:4,ageMax:7},
{id:"logic.pack.associations-intermediate",title:"Intermediate Associations",lessonId:"logic-associations-intermediate",ageMin:4,ageMax:7},
{id:"logic.pack.comparisons-intermediate",title:"Intermediate Comparisons",lessonId:"logic-comparisons-intermediate",ageMin:4,ageMax:7},
{id:"logic.pack.spatial-relations",title:"Basic Spatial Relations",lessonId:"logic-spatial-relations",ageMin:4,ageMax:7}
],skills:[
{id:"logic.pattern.repeat.intermediate",subjectId:"logic",title:"Pola berulang menengah",description:"Meneruskan pola berulang dua sampai empat langkah.",domain:"reasoning",ageMin:4,ageMax:7},
{id:"logic.sequence.position.intermediate",subjectId:"logic",title:"Urutan perubahan menengah",description:"Meneruskan urutan berdasarkan perubahan jumlah, arah, atau siklus.",domain:"reasoning",ageMin:4,ageMax:7},
{id:"logic.association.semantic.intermediate",subjectId:"logic",title:"Asosiasi relasional menengah",description:"Mencocokkan pasangan berdasarkan fungsi, bagian-utuh, atau hubungan arah.",domain:"reasoning",ageMin:4,ageMax:7},
{id:"logic.comparison.relation.intermediate",subjectId:"logic",title:"Perbandingan relasional menengah",description:"Membandingkan panjang, jumlah, dan kesetaraan secara visual.",domain:"reasoning",ageMin:4,ageMax:7},
{id:"logic.spatial.relation.basic",subjectId:"logic",title:"Relasi spasial dasar",description:"Menentukan posisi kiri-kanan-tengah serta perubahan arah sederhana.",domain:"reasoning",ageMin:4,ageMax:7}
],activities:[...patterns,...sequences,...associations,...comparisons,...spatial]};
