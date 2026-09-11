import type { ScienceBatch13ActivitySeed, ScienceBatch13WaveDefinition } from "./scienceBatch13Authoring";

const STAGE_ID = "science-life-material-motion";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,choices:string[],correctChoice:string,skillId:string,options:SeedOptions={}):ScienceBatch13ActivitySeed{return{kind:"choice",id,packId,lessonId,title,description,emoji:options.emoji??"🔬",ageMin:options.ageMin??4,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,choices,correctChoice};}
function matching(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,skillId:string,pairs:Array<{left:string;right:string;pair:string}>,options:SeedOptions={}):ScienceBatch13ActivitySeed{return{kind:"matching",id,packId,lessonId,title,description,emoji:options.emoji??"🧩",ageMin:options.ageMin??4,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,matchItems:pairs.flatMap(({left,right,pair})=>[{label:left,pair},{label:right,pair}])};}

const lifeCycles=[
choice("science-cycle-butterfly","science.pack.life-cycles","science-life-cycles","Siklus kupu-kupu","Mengenali urutan perubahan kupu-kupu.","Urutan mana yang benar untuk siklus hidup kupu-kupu?",["telur → ulat → kepompong → kupu-kupu","ulat → telur → kupu-kupu → kepompong","kupu-kupu → kepompong → telur → ulat"],"telur → ulat → kepompong → kupu-kupu","science.life_cycles.basic",{required:true,difficulty:2}),
choice("science-cycle-frog","science.pack.life-cycles","science-life-cycles","Katak tumbuh dari berudu","Mengenali tahap awal pertumbuhan katak.","Sebelum menjadi katak dewasa, anak katak hidup di air sebagai apa?",["berudu","ulat","anak ayam"],"berudu","science.life_cycles.basic"),
choice("science-cycle-chick","science.pack.life-cycles","science-life-cycles","Anak ayam bertumbuh","Menghubungkan anak hewan dengan bentuk dewasanya.","Anak ayam akan tumbuh menjadi apa?",["ayam dewasa","bebek dewasa","burung merpati"],"ayam dewasa","science.life_cycles.basic"),
choice("science-cycle-seed-sprout","science.pack.life-cycles","science-life-cycles","Biji mulai berkecambah","Mengenali kecambah sebagai tahap awal pertumbuhan tanaman.","Setelah biji mulai tumbuh, tahap muda yang muncul disebut apa?",["kecambah","batu","buah matang"],"kecambah","science.life_cycles.basic"),
matching("science-match-young-adult-b","science.pack.life-cycles","science-life-cycles","Muda dan dewasa","Mencocokkan bentuk muda dengan hewan dewasanya.","Pasangkan bentuk muda dengan bentuk dewasanya.","science.life_cycles.basic",[{left:"anak kucing",right:"kucing",pair:"cat"},{left:"anak sapi",right:"sapi",pair:"cow"},{left:"berudu",right:"katak",pair:"frog"}],{required:true})
];

const needsFood=[
choice("science-animal-needs-food-water","science.pack.organism-needs-food","science-organism-needs-food","Hewan perlu makan dan minum","Mengenali kebutuhan dasar hewan.","Mana yang dibutuhkan hewan untuk tetap hidup?",["makanan dan air","mainan dan cat","batu dan plastik"],"makanan dan air","science.organisms.needs_food.basic",{required:true}),
choice("science-cow-eats-grass","science.pack.organism-needs-food","science-organism-needs-food","Sapi makan rumput","Menghubungkan hewan familiar dengan makanannya.","Makanan mana yang biasa dimakan sapi?",["rumput","batu","kaca"],"rumput","science.organisms.needs_food.basic"),
choice("science-bird-eats-seeds","science.pack.organism-needs-food","science-organism-needs-food","Burung dapat makan biji","Mengenali salah satu sumber makanan burung.","Mana yang dapat menjadi makanan bagi banyak burung kecil?",["biji-bijian","sendok logam","kelereng"],"biji-bijian","science.organisms.needs_food.basic"),
choice("science-simple-food-chain","science.pack.organism-needs-food","science-organism-needs-food","Rantai makanan sederhana","Mengenali aliran makanan sederhana dari tumbuhan ke hewan.","Urutan makan sederhana mana yang masuk akal?",["daun → ulat → burung","burung → daun → ulat","ulat → batu → burung"],"daun → ulat → burung","science.organisms.needs_food.basic",{difficulty:3,ageMin:5}),
matching("science-match-animal-food-b","science.pack.organism-needs-food","science-organism-needs-food","Hewan dan makanan","Mencocokkan hewan dengan makanan familiar.","Pasangkan hewan dengan makanan yang sesuai.","science.organisms.needs_food.basic",[{left:"🐰 kelinci",right:"sayuran",pair:"rabbit"},{left:"🐼 panda",right:"bambu",pair:"panda"},{left:"🐸 katak",right:"serangga kecil",pair:"frog"}],{difficulty:2})
];

const materials=[
choice("science-material-glass-transparent","science.pack.material-properties","science-material-properties","Kaca dapat tembus pandang","Mengenali sifat transparan pada kaca bening.","Bahan mana yang biasanya dapat ditembus cahaya sehingga benda di baliknya terlihat?",["kaca bening","kayu tebal","batu"],"kaca bening","science.materials.properties.basic",{required:true}),
choice("science-material-rubber-flexible","science.pack.material-properties","science-material-properties","Karet lentur","Mengenali bahan yang dapat ditekuk atau diregangkan.","Bahan mana yang biasanya paling lentur?",["karet","kaca","batu"],"karet","science.materials.properties.basic"),
choice("science-material-sponge-absorbs","science.pack.material-properties","science-material-properties","Spons menyerap air","Menghubungkan spons dengan sifat menyerap cairan.","Benda mana yang paling cocok untuk menyerap air tumpah?",["spons","kelereng","sendok logam"],"spons","science.materials.properties.basic"),
choice("science-material-metal-spoon","science.pack.material-properties","science-material-properties","Sendok dari logam","Mengenali contoh benda yang umum dibuat dari logam.","Benda mana yang sering dibuat dari logam?",["sendok makan","tisu","balon karet"],"sendok makan","science.materials.properties.basic"),
matching("science-match-material-property-b","science.pack.material-properties","science-material-properties","Bahan dan sifatnya","Mencocokkan bahan umum dengan sifat yang mudah diamati.","Pasangkan bahan dengan sifat yang paling sesuai.","science.materials.properties.basic",[{left:"karet",right:"lentur",pair:"rubber"},{left:"spons",right:"menyerap air",pair:"sponge"},{left:"kaca bening",right:"transparan",pair:"glass"}],{difficulty:2})
];

const waterChanges=[
choice("science-water-ice-melts","science.pack.water-changes","science-water-changes","Es mencair","Mengenali perubahan es menjadi air saat menerima panas.","Apa yang terjadi pada es jika dibiarkan di tempat yang lebih hangat?",["mencair menjadi air","membeku lebih keras","berubah menjadi batu"],"mencair menjadi air","science.water.state_changes.basic",{required:true}),
choice("science-water-freezes","science.pack.water-changes","science-water-changes","Air membeku","Mengenali perubahan air cair menjadi es pada suhu sangat dingin.","Apa yang dapat terjadi pada air jika cukup didinginkan di freezer?",["membeku menjadi es","menjadi pasir","berubah menjadi kayu"],"membeku menjadi es","science.water.state_changes.basic"),
choice("science-water-puddle-evaporates","science.pack.water-changes","science-water-changes","Genangan dapat mengering","Menghubungkan panas dengan penguapan air.","Mengapa genangan kecil dapat makin berkurang pada hari hangat?",["air menguap ke udara","air berubah menjadi tanah","air berubah menjadi plastik"],"air menguap ke udara","science.water.state_changes.basic",{difficulty:3,ageMin:5}),
choice("science-water-cold-glass-droplets","science.pack.water-changes","science-water-changes","Tetes di gelas dingin","Mengenali kondensasi sederhana pada permukaan dingin.","Tetes air dapat muncul di luar gelas yang sangat dingin karena apa?",["uap air di udara mengembun","kaca berubah menjadi air","es menembus dinding gelas"],"uap air di udara mengembun","science.water.state_changes.basic",{difficulty:3,ageMin:5}),
matching("science-match-water-states-b","science.pack.water-changes","science-water-changes","Wujud air","Mencocokkan contoh air dengan wujudnya.","Pasangkan contoh air dengan wujudnya.","science.water.state_changes.basic",[{left:"es batu",right:"padat",pair:"solid"},{left:"air minum",right:"cair",pair:"liquid"},{left:"uap air",right:"gas",pair:"gas"}],{difficulty:2,ageMin:5})
];

const forces=[
choice("science-force-push-door","science.pack.forces-motion","science-forces-motion","Mendorong pintu","Mengenali dorongan sebagai gaya.","Saat kamu mendorong pintu menjauh, gaya apa yang kamu berikan?",["dorongan","tarikan","cahaya"],"dorongan","science.forces.motion.basic",{required:true}),
choice("science-force-pull-drawer","science.pack.forces-motion","science-forces-motion","Menarik laci","Mengenali tarikan sebagai gaya.","Saat membuka laci ke arahmu, gerakan tangan terutama berupa apa?",["tarikan","dorongan menjauh","pantulan cahaya"],"tarikan","science.forces.motion.basic"),
choice("science-force-gravity-ball","science.pack.forces-motion","science-forces-motion","Bola jatuh ke bawah","Mengenali pengaruh gravitasi pada benda yang dilepas.","Jika bola dilepas dari tangan, ke arah mana biasanya bergerak karena gravitasi?",["ke bawah","terus ke atas","diam melayang"],"ke bawah","science.forces.motion.basic",{difficulty:2}),
choice("science-force-rough-surface-slow","science.pack.forces-motion","science-forces-motion","Permukaan kasar memperlambat","Menghubungkan gesekan lebih besar dengan gerak yang lebih cepat melambat.","Mobil mainan yang sama biasanya lebih cepat melambat di permukaan mana?",["karpet kasar","lantai halus","meja licin"],"karpet kasar","science.forces.motion.basic",{difficulty:3,ageMin:5}),
matching("science-match-push-pull-b","science.pack.forces-motion","science-forces-motion","Dorong atau tarik","Mencocokkan tindakan sederhana dengan jenis gaya.","Pasangkan tindakan dengan jenis gayanya.","science.forces.motion.basic",[{left:"mendorong troli",right:"dorong",pair:"push"},{left:"menarik tali",right:"tarik",pair:"pull"},{left:"menarik pintu ke arahmu",right:"tarik ke arah diri",pair:"pullself"}],{difficulty:2})
];

export const SCIENCE_BATCH13_WAVE_B:ScienceBatch13WaveDefinition={wave:"B",stage:{id:STAGE_ID,subjectId:"science",title:"Siklus Hidup, Bahan & Gerak",subtitle:"Pelajari perubahan makhluk hidup, sifat bahan, perubahan air, serta gaya dan gerak.",emoji:"🧪"},lessons:[
{id:"science-life-cycles",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Siklus hidup",objective:"Mengenali tahap pertumbuhan sederhana pada hewan dan tumbuhan.",ageMin:4,ageMax:7},
{id:"science-organism-needs-food",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Makanan dan kebutuhan makhluk hidup",objective:"Menghubungkan hewan dengan kebutuhan dan sumber makanan yang familiar.",ageMin:4,ageMax:7},
{id:"science-material-properties",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Sifat bahan",objective:"Membedakan bahan berdasarkan sifat yang dapat diamati seperti lentur, menyerap, dan transparan.",ageMin:4,ageMax:7},
{id:"science-water-changes",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Air dan perubahan wujud",objective:"Mengenali mencair, membeku, menguap, dan mengembun melalui contoh sehari-hari.",ageMin:4,ageMax:7},
{id:"science-forces-motion",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Gaya dan gerak",objective:"Mengenali dorong, tarik, gravitasi, serta pengaruh permukaan pada gerak.",ageMin:4,ageMax:7}
],packs:[
{id:"science.pack.life-cycles",title:"Life Cycles",lessonId:"science-life-cycles",ageMin:4,ageMax:7},
{id:"science.pack.organism-needs-food",title:"Organism Needs and Food",lessonId:"science-organism-needs-food",ageMin:4,ageMax:7},
{id:"science.pack.material-properties",title:"Material Properties",lessonId:"science-material-properties",ageMin:4,ageMax:7},
{id:"science.pack.water-changes",title:"Water State Changes",lessonId:"science-water-changes",ageMin:4,ageMax:7},
{id:"science.pack.forces-motion",title:"Forces and Motion",lessonId:"science-forces-motion",ageMin:4,ageMax:7}
],skills:[
{id:"science.life_cycles.basic",subjectId:"science",title:"Siklus hidup dasar",description:"Mengenali tahap pertumbuhan sederhana pada hewan dan tumbuhan.",domain:"science",ageMin:4,ageMax:7},
{id:"science.organisms.needs_food.basic",subjectId:"science",title:"Kebutuhan dan makanan makhluk hidup",description:"Menghubungkan hewan dengan kebutuhan dasar dan sumber makanan familiar.",domain:"science",ageMin:4,ageMax:7},
{id:"science.materials.properties.basic",subjectId:"science",title:"Sifat bahan dasar",description:"Membedakan bahan berdasarkan sifat fisik yang mudah diamati.",domain:"science",ageMin:4,ageMax:7},
{id:"science.water.state_changes.basic",subjectId:"science",title:"Perubahan wujud air dasar",description:"Mengenali perubahan wujud air melalui contoh sehari-hari.",domain:"science",ageMin:4,ageMax:7},
{id:"science.forces.motion.basic",subjectId:"science",title:"Gaya dan gerak dasar",description:"Mengenali dorong, tarik, gravitasi, dan pengaruh permukaan pada gerak.",domain:"science",ageMin:4,ageMax:7}
],activities:[...lifeCycles,...needsFood,...materials,...waterChanges,...forces]};
