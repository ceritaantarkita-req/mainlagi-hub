import type { ScienceBatch13ActivitySeed, ScienceBatch13WaveDefinition } from "./scienceBatch13Authoring";

const STAGE_ID = "science-living-observation-basics";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,choices:string[],correctChoice:string,skillId:string,options:SeedOptions={}):ScienceBatch13ActivitySeed{return{kind:"choice",id,packId,lessonId,title,description,emoji:options.emoji??"🔬",ageMin:options.ageMin??3,ageMax:7,difficulty:options.difficulty??1,requiredForStage:options.required??false,skillId,prompt,choices,correctChoice};}
function matching(id:string,packId:string,lessonId:string,title:string,description:string,prompt:string,skillId:string,pairs:Array<{left:string;right:string;pair:string}>,options:SeedOptions={}):ScienceBatch13ActivitySeed{return{kind:"matching",id,packId,lessonId,title,description,emoji:options.emoji??"🧩",ageMin:options.ageMin??4,ageMax:7,difficulty:options.difficulty??2,requiredForStage:options.required??false,skillId,prompt,matchItems:pairs.flatMap(({left,right,pair})=>[{label:left,pair},{label:right,pair}])};}

const living=[
choice("science-living-dog","science.pack.living-nonliving","science-living-nonliving","Anjing itu hidup","Mengenali hewan sebagai makhluk hidup.","Mana yang merupakan makhluk hidup?",["🐶 anjing","🪨 batu","🧸 boneka"],"🐶 anjing","science.living.basic_classification",{required:true}),
choice("science-nonliving-rock","science.pack.living-nonliving","science-living-nonliving","Batu bukan makhluk hidup","Membedakan benda tak hidup dari makhluk hidup.","Mana yang bukan makhluk hidup?",["🪨 batu","🌱 tanaman","🐦 burung"],"🪨 batu","science.living.basic_classification"),
choice("science-living-tree","science.pack.living-nonliving","science-living-nonliving","Pohon bertumbuh","Mengenali tumbuhan sebagai makhluk hidup.","Mana yang dapat tumbuh sebagai makhluk hidup?",["🌳 pohon","⚽ bola","🚗 mobil"],"🌳 pohon","science.living.basic_classification"),
choice("science-living-needs-water","science.pack.living-nonliving","science-living-nonliving","Makhluk hidup perlu air","Mengenali kebutuhan dasar makhluk hidup.","Apa yang dibutuhkan banyak makhluk hidup untuk tetap hidup?",["💧 air","🧱 batu bata","🧸 mainan"],"💧 air","science.living.basic_classification",{difficulty:2}),
matching("science-match-living-nonliving","science.pack.living-nonliving","science-living-nonliving","Kelompok hidup dan tak hidup","Mengelompokkan contoh familiar sebagai hidup atau tak hidup.","Pasangkan benda dengan kelompoknya.","science.living.basic_classification",[{left:"🐱 kucing",right:"makhluk hidup",pair:"living"},{left:"🪑 kursi",right:"benda tak hidup",pair:"nonliving"},{left:"🌻 bunga",right:"tumbuhan hidup",pair:"plant"}],{required:true})
];

const plants=[
choice("science-plant-needs-sunlight","science.pack.plant-basics","science-plant-basics","Tanaman perlu cahaya","Mengenali cahaya sebagai salah satu kebutuhan tumbuhan.","Apa yang membantu tanaman hijau tumbuh?",["☀️ cahaya matahari","📺 televisi","🧸 boneka"],"☀️ cahaya matahari","science.plants.parts_needs.basic",{required:true}),
choice("science-plant-roots","science.pack.plant-basics","science-plant-basics","Akar di bawah","Mengenali akar sebagai bagian tumbuhan yang biasanya berada di tanah.","Bagian tanaman mana yang biasanya berada di dalam tanah?",["akar","daun","bunga"],"akar","science.plants.parts_needs.basic"),
choice("science-plant-leaves","science.pack.plant-basics","science-plant-basics","Kenali daun","Mengenali daun sebagai bagian tumbuhan.","Mana yang merupakan bagian tumbuhan?",["🍃 daun","🛞 roda","🥄 sendok"],"🍃 daun","science.plants.parts_needs.basic"),
choice("science-seed-grows-plant","science.pack.plant-basics","science-plant-basics","Biji dapat tumbuh","Menghubungkan biji dengan pertumbuhan tanaman.","Dengan air dan kondisi yang sesuai, biji dapat tumbuh menjadi apa?",["tanaman","batu","gelas"],"tanaman","science.plants.parts_needs.basic",{difficulty:2}),
matching("science-match-plant-parts","science.pack.plant-basics","science-plant-basics","Bagian dan tugas tumbuhan","Mencocokkan bagian tumbuhan dengan fungsi dasar yang mudah diamati.","Pasangkan bagian tumbuhan dengan tugas sederhananya.","science.plants.parts_needs.basic",[{left:"akar",right:"menyerap air",pair:"root"},{left:"batang",right:"menopang tanaman",pair:"stem"},{left:"daun",right:"menangkap cahaya",pair:"leaf"}],{difficulty:2})
];

const animals=[
choice("science-animal-fur-cat","science.pack.animal-basics","science-animal-basics","Kucing berbulu","Mengenali penutup tubuh hewan familiar.","Hewan mana yang memiliki bulu?",["🐱 kucing","🐟 ikan","🐢 kura-kura"],"🐱 kucing","science.animals.features_habitat.basic",{required:true,ageMin:4}),
choice("science-animal-fins-fish","science.pack.animal-basics","science-animal-basics","Ikan memakai sirip","Menghubungkan hewan dengan bagian tubuh untuk bergerak.","Bagian tubuh apa yang membantu ikan berenang?",["sirip","sayap","kaki depan"],"sirip","science.animals.features_habitat.basic",{ageMin:4}),
choice("science-animal-bird-wings","science.pack.animal-basics","science-animal-basics","Burung punya sayap","Mengenali sayap sebagai ciri tubuh burung.","Hewan mana yang memiliki sayap?",["🐦 burung","🐄 sapi","🐠 ikan"],"🐦 burung","science.animals.features_habitat.basic",{ageMin:4}),
matching("science-match-animal-homes-a","science.pack.animal-basics","science-animal-basics","Hewan dan tempat hidup","Menghubungkan hewan dengan habitat familiar.","Pasangkan hewan dengan tempat hidup yang sesuai.","science.animals.features_habitat.basic",[{left:"🐟 ikan",right:"air",pair:"fish"},{left:"🐦 burung",right:"sarang",pair:"bird"},{left:"🐰 kelinci",right:"liang",pair:"rabbit"}],{required:true})
];

const senses=[
choice("science-sense-eyes-see","science.pack.senses-observation","science-senses-observation","Mata untuk melihat","Menghubungkan mata dengan indera penglihatan.","Bagian tubuh apa yang kita gunakan untuk melihat?",["mata","telinga","hidung"],"mata","science.observation.senses.basic",{required:true}),
choice("science-sense-ears-hear","science.pack.senses-observation","science-senses-observation","Telinga untuk mendengar","Menghubungkan telinga dengan indera pendengaran.","Bagian tubuh apa yang kita gunakan untuk mendengar bunyi?",["telinga","mata","lidah"],"telinga","science.observation.senses.basic"),
choice("science-sense-nose-smell","science.pack.senses-observation","science-senses-observation","Hidung untuk mencium","Menghubungkan hidung dengan indera penciuman.","Bagian tubuh apa yang membantu mencium aroma?",["hidung","lutut","siku"],"hidung","science.observation.senses.basic"),
matching("science-match-senses-a","science.pack.senses-observation","science-senses-observation","Indera dan pengamatan","Mencocokkan indera dengan jenis pengamatan sederhana.","Pasangkan indera dengan hal yang dapat diamati.","science.observation.senses.basic",[{left:"mata",right:"warna",pair:"sight"},{left:"telinga",right:"bunyi",pair:"hearing"},{left:"hidung",right:"aroma",pair:"smell"}],{difficulty:2})
];

const weather=[
choice("science-weather-rain-clue","science.pack.weather-daynight","science-weather-daynight","Tanda hujan","Mengenali hujan dari gejala yang langsung terlihat.","Kondisi mana yang menunjukkan sedang hujan?",["air turun dari awan","langit penuh bintang","matahari terbit cerah"],"air turun dari awan","science.weather.daynight.basic",{required:true,ageMin:4}),
choice("science-day-sun","science.pack.weather-daynight","science-weather-daynight","Matahari di siang hari","Menghubungkan matahari dengan pengamatan siang hari.","Apa yang biasanya tampak di langit pada siang hari yang cerah?",["☀️ matahari","🌙 bulan sabit terang","⭐ banyak bintang"],"☀️ matahari","science.weather.daynight.basic",{ageMin:4}),
choice("science-night-stars","science.pack.weather-daynight","science-weather-daynight","Bintang di malam hari","Menghubungkan bintang dengan pengamatan malam hari.","Kapan bintang biasanya lebih mudah terlihat?",["malam hari","siang terik","saat lampu kamar menyala"],"malam hari","science.weather.daynight.basic",{ageMin:4}),
matching("science-match-weather-signs-a","science.pack.weather-daynight","science-weather-daynight","Cuaca dan tandanya","Mencocokkan kondisi cuaca dengan tanda sederhana.","Pasangkan cuaca dengan tanda yang sesuai.","science.weather.daynight.basic",[{left:"hujan",right:"tetes air",pair:"rain"},{left:"berangin",right:"daun bergerak",pair:"wind"},{left:"cerah",right:"cahaya matahari kuat",pair:"sunny"}],{difficulty:2})
];

export const SCIENCE_BATCH13_WAVE_A:ScienceBatch13WaveDefinition={wave:"A",stage:{id:STAGE_ID,subjectId:"science",title:"Makhluk Hidup & Observasi Dasar",subtitle:"Kenali hidup dan tak hidup, tumbuhan, hewan, indera, serta cuaca sehari-hari.",emoji:"🔬"},lessons:[
{id:"science-living-nonliving",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Hidup dan tak hidup",objective:"Membedakan contoh makhluk hidup, tumbuhan, dan benda tak hidup di sekitar.",ageMin:3,ageMax:7},
{id:"science-plant-basics",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Bagian dan kebutuhan tumbuhan",objective:"Mengenali bagian tumbuhan serta kebutuhan dasarnya melalui contoh sederhana.",ageMin:3,ageMax:7},
{id:"science-animal-basics",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Ciri dan habitat hewan",objective:"Menghubungkan hewan familiar dengan ciri tubuh dan tempat hidupnya.",ageMin:4,ageMax:7},
{id:"science-senses-observation",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Indera untuk mengamati",objective:"Menghubungkan mata, telinga, dan hidung dengan pengamatan sederhana.",ageMin:3,ageMax:7},
{id:"science-weather-daynight",subjectId:"science",pathId:"science-discovery-foundations",stageId:STAGE_ID,title:"Cuaca dan siang-malam",objective:"Mengenali tanda cuaca dan perbedaan pengamatan langit siang serta malam.",ageMin:4,ageMax:7}
],packs:[
{id:"science.pack.living-nonliving",title:"Living and Non-Living Basics",lessonId:"science-living-nonliving",ageMin:3,ageMax:7},
{id:"science.pack.plant-basics",title:"Plant Parts and Needs",lessonId:"science-plant-basics",ageMin:3,ageMax:7},
{id:"science.pack.animal-basics",title:"Animal Features and Habitats",lessonId:"science-animal-basics",ageMin:4,ageMax:7},
{id:"science.pack.senses-observation",title:"Senses and Observation",lessonId:"science-senses-observation",ageMin:3,ageMax:7},
{id:"science.pack.weather-daynight",title:"Weather and Day Night",lessonId:"science-weather-daynight",ageMin:4,ageMax:7}
],skills:[
{id:"science.living.basic_classification",subjectId:"science",title:"Klasifikasi hidup dasar",description:"Membedakan makhluk hidup, tumbuhan, dan benda tak hidup pada contoh familiar.",domain:"science",ageMin:3,ageMax:7},
{id:"science.plants.parts_needs.basic",subjectId:"science",title:"Bagian dan kebutuhan tumbuhan",description:"Mengenali bagian tumbuhan serta kebutuhan dasar untuk pertumbuhan.",domain:"science",ageMin:3,ageMax:7},
{id:"science.animals.features_habitat.basic",subjectId:"science",title:"Ciri dan habitat hewan",description:"Menghubungkan hewan familiar dengan ciri tubuh dan habitat sederhananya.",domain:"science",ageMin:4,ageMax:7},
{id:"science.observation.senses.basic",subjectId:"science",title:"Observasi dengan indera",description:"Menghubungkan indera dengan jenis pengamatan sederhana.",domain:"science",ageMin:3,ageMax:7},
{id:"science.weather.daynight.basic",subjectId:"science",title:"Cuaca dan siang-malam",description:"Mengenali tanda cuaca dan pengamatan dasar siang serta malam.",domain:"science",ageMin:4,ageMax:7}
],activities:[...living,...plants,...animals,...senses,...weather]};
