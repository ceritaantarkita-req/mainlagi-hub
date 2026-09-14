/**
 * Presentation-only vector artwork. Does not change catalog, assessment,
 * completion, evidence, or progression. Regions are spatial shapes, not labels.
 */
export interface ColoringRegion { name:string; path:string; transform?:string }
const p=(name:string,path:string):ColoringRegion=>({name,path});
const circle=(name:string,x:number,y:number,r:number)=>p(name,`M ${x-r} ${y} a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 ${-r*2} 0 Z`);
const box=(name:string,x:number,y:number,w:number,h:number)=>p(name,`M${x} ${y} h${w} v${h} h${-w}Z`);
const star=p("Bintang","M240 80 279 180 390 185 304 256 331 368 240 305 149 368 176 256 90 185 201 180Z");
const cloud=p("Awan","M105 230 C65 215 75 155 125 155 C130 90 215 87 242 133 C283 95 350 129 347 173 C403 173 419 236 374 254 L120 254 Q96 252 105 230Z");
const leaf=p("Daun","M130 360 C50 165 230 85 355 95 C355 275 280 410 130 360Z");
const sun=[star,circle("Pusat matahari",240,228,75)];
const flower=[
  box("Batang",232,235,16,180),
  p("Daun kiri","M236 356 Q125 359 124 294 Q208 281 236 356Z"),
  p("Daun kanan","M249 324 Q336 315 357 247 Q268 246 249 324Z"),
  ...[0,1,2,3,4,5].map(i=>({...circle("Kelopak "+(i+1),240,132,54),transform:`rotate(${i*60} 240 217)`})),
  circle("Tengah bunga",240,217,47)
];
const house=[
  box("Dinding",115,208,250,204),
  p("Atap","M77 210 240 70 403 210Z"),
  box("Pintu",219,299,69,113),box("Jendela",145,250,50,53),
  box("Jendela kanan",304,250,40,53),circle("Gagang pintu",270,358,5)
];
const robot=[
  p("Antena","M231 69 H249 V126 H231Z"),circle("Ujung antena",240,65,24),
  p("Tangan kiri","M150 253 Q87 262 70 328 L96 342 Q130 287 165 290Z"),
  p("Tangan kanan","M330 253 Q393 262 410 328 L384 342 Q350 287 315 290Z"),
  p("Kaki kiri","M178 350 170 413 226 413 222 350Z"),
  p("Kaki kanan","M258 350 258 413 313 413 302 350Z"),
  p("Badan","M188 250 H292 Q331 250 330 300 V330 Q330 368 292 368 H188 Q150 368 150 330 V290 Q150 250 188 250Z"),
  p("Kepala","M176 114 H304 Q345 114 345 153 V210 Q345 250 304 250 H176 Q135 250 135 210 V154 Q135 114 176 114Z"),
  p("Layar wajah","M180 140 H300 Q318 140 318 164 V200 Q318 224 298 224 H182 Q162 224 162 200 V164 Q162 140 180 140Z"),
  circle("Mata kiri",199,180,14),circle("Mata kanan",281,180,14),
  p("Senyum","M219 201 Q240 218 261 201 Q240 239 219 201Z"),
  box("Panel perut",183,278,92,59),circle("Tombol",298,296,10),
  p("Sepatu kiri","M164 402 H227 V435 H143 Q142 412 164 402Z"),
  p("Sepatu kanan","M258 402 H318 Q340 412 339 435 H258Z")
];
const cat=[
  p("Ekor","M310 335 C405 370 433 228 369 250 C408 280 352 330 315 299Z"),
  p("Badan","M192 235 Q139 319 160 399 Q240 433 324 393 Q333 298 287 236Z"),
  p("Telinga kiri","M128 177 123 62 219 128Z"),p("Telinga kanan","M270 125 353 61 351 180Z"),
  p("Kepala","M127 161 Q137 98 240 102 Q343 98 354 166 Q377 266 241 279 Q103 265 127 161Z"),
  p("Wajah","M240 176 Q224 221 173 212 Q153 271 240 272 Q327 271 309 212 Q260 223 240 176Z"),
  circle("Mata kiri",186,175,16),circle("Mata kanan",294,175,16),
  p("Hidung","M224 216 Q240 207 256 216 L240 233Z"),
  p("Kaki kiri","M160 365 Q137 371 144 402 Q183 419 217 402 V374Z"),
  p("Kaki kanan","M266 374 V402 Q299 419 336 402 Q343 371 319 365Z")
];
const fish=[
  p("Ekor ikan","M324 235 418 154 405 314Z"),
  p("Sirip atas","M186 169 Q252 71 294 165Z"),
  p("Sirip bawah","M194 301 285 310 236 367Z"),
  p("Badan ikan","M62 241 Q164 84 338 229 Q183 397 62 241Z"),
  p("Sirip tengah","M212 221 Q279 226 253 281Z"),
  circle("Mata ikan",131,227,17),circle("Gelembung",76,115,21),circle("Gelembung kecil",115,65,12)
];
const butterfly=[
  p("Sayap kiri atas","M231 240 C33 20 13 262 207 288Z"),
  p("Sayap kanan atas","M249 240 C447 20 467 262 273 288Z"),
  p("Sayap kiri bawah","M229 259 C50 242 104 438 231 355Z"),
  p("Sayap kanan bawah","M251 259 C430 242 376 438 249 355Z"),
  p("Tubuh kupu-kupu","M222 200 Q240 183 258 200 L256 353 Q240 391 224 353Z"),
  circle("Kepala",240,188,25),circle("Pola kiri",145,192,29),circle("Pola kanan",335,192,29)
];
const car=[
  p("Badan mobil","M70 251 116 242 166 160 H310 L364 245 H398 Q420 245 420 276 V338 H63 V275Q63 251 70 251Z"),
  p("Kaca depan","M173 180 H231 V244 H132Z"),p("Kaca belakang","M248 180 H302 L340 244 H248Z"),
  circle("Roda kiri",136,336,45),circle("Roda kanan",348,336,45),
  circle("Velg kiri",136,336,20),circle("Velg kanan",348,336,20),box("Lampu",382,264,29,22)
];
const boat=[
  p("Lambung perahu","M70 302 H410 L343 380 H137Z"),box("Tiang",233,96,13,207),
  p("Layar kiri","M222 112 V283 H83Z"),p("Layar kanan","M257 128 397 283 H257Z"),
  p("Air","M35 386 Q85 351 135 386 T235 386 T335 386 T445 386 V430 H35Z")
];
const tree=[
  p("Batang","M224 218 H255 L271 411 H207Z"),
  p("Daun pohon","M134 306 C37 293 62 195 126 190 C106 95 223 60 249 110 C330 53 397 126 363 185 C444 212 406 302 339 306Z"),
  p("Tanah","M100 411 Q240 375 381 411 L404 443 H78Z")
];
const umbrella=[
  p("Pegangan payung","M233 228 H247 V365 Q246 424 190 410 Q160 400 170 373 H185 Q180 398 214 390 Q233 386 233 362Z"),
  p("Payung kiri","M64 238 Q79 107 239 109 Q155 158 153 238 Q109 203 64 238Z"),
  p("Payung tengah","M153 238 Q159 151 239 109 Q314 156 325 238 Q239 200 153 238Z"),
  p("Payung kanan","M325 238 Q315 155 239 109 Q400 107 416 238 Q371 202 325 238Z")
];
const balloon=[p("Tali","M233 275 H244 Q211 345 249 405 H239 Q203 345 233 275Z"),p("Balon","M150 173 C150 35 332 35 332 173 C332 250 264 285 240 295 C212 280 150 245 150 173Z")];
const cup=[p("Pegangan","M300 164 C420 115 422 340 299 305 L301 278 C377 299 380 164 303 193Z"),p("Cangkir","M113 150 H316 V285 Q300 360 217 357 Q130 360 113 285Z"),p("Alas","M83 360 H356 Q330 406 120 391Z")];
const rocket=[p("Api","M199 326 240 431 283 326Z"),p("Sirip kiri","M181 238 113 323 190 314Z"),p("Sirip kanan","M299 238 367 323 290 314Z"),p("Badan roket","M240 55 Q158 127 185 326 H295 Q320 128 240 55Z"),circle("Jendela roket",240,195,40)];
const bird=[p("Ekor","M298 286 397 350 363 251Z"),p("Badan burung","M131 222 C111 103 263 95 290 218 Q367 306 291 346 Q150 385 131 222Z")];
bird.push(p("Sayap","M185 233 Q230 185 276 252 Q256 333 185 233Z"),p("Paruh","M137 179 76 213 141 228Z"),circle("Mata",170,172,12));
const motifs: Record<string,ColoringRegion[]> = {
  robot, cat, fish, butterfly, car, boat, tree, flower, umbrella, balloon, cup, rocket, bird,
  circle:[circle("Lingkaran besar",240,240,155),circle("Lingkaran tengah",240,240,95),circle("Lingkaran kecil",240,240,38)],
  square:[box("Persegi luar",95,95,290,290),box("Persegi tengah",150,150,180,180),box("Persegi kecil",205,205,70,70)],
  triangle:[p("Segitiga","M240 65 422 398H58Z"),p("Segitiga kecil","M240 179 338 355H142Z")],
  star:[star], heart:[p("Hati","M240 408 C-50 228 121 16 240 152 C361 16 530 228 240 408Z")],
  ball:[circle("Bola",240,240,156),p("Pola tengah","M240 149 326 211 294 313H186L154 211Z")],
  apple:[p("Apel","M240 153 C68 54 39 362 176 398 Q241 377 301 398 C439 362 413 54 240 153Z"),p("Daun apel","M245 135 Q251 65 331 68 Q318 139 245 135Z"),box("Tangkai",229,84,16,69)],
  house, sun, cloud:[cloud], leaf:[leaf,p("Sisi daun","M130 360 355 95 Q343 339 130 360Z")],
  kite:[p("Kiri","M240 63 105 215 240 360Z"),p("Kanan","M240 63 375 215 240 360Z"),p("Ekor","M237 360H245V444H237Z")],
  fire:[p("Api luar","M240 61 C260 182 398 160 371 291 C352 427 106 427 109 294 C101 207 185 183 240 61Z"),p("Api dalam","M240 222 C255 286 311 275 297 347 C270 399 196 388 181 347 C166 300 216 278 240 222Z")],
  snow:[circle("Badan salju",240,310,105),circle("Kepala salju",240,155,76),box("Syal",170,215,140,32),circle("Mata kiri",213,151,8),circle("Mata kanan",269,151,8),p("Hidung","M236 169 281 183 237 190Z")],
  castle:[box("Menara kiri",75,168,90,240),box("Menara kanan",315,168,90,240),box("Dinding tengah",165,238,150,170),p("Atap kiri","M57 168 120 70 183 168Z"),p("Atap kanan","M297 168 360 70 423 168Z"),p("Gerbang","M207 408 V328 A33 33 0 0 1 66 0 V408Z")],
  shell:[p("Kerang","M211 391 C-20 280 86 96 156 140 C193 37 287 40 322 140 C397 94 500 290 269 391Z"),p("Belahan kerang","M240 100 L269 391 H211Z")],
  sign:[box("Tiang papan",225,248,30,176),box("Papan",75,96,330,176),circle("Simbol papan",240,183,60)],
  space:[circle("Planet",240,240,111),p("Cincin","M103 240 C-20 385 500 370 375 176 Q452 306 86 297 L103 240Z"),{...star,transform:"translate(14 -10) scale(.25)"}],
  room:[box("Lantai",50,350,380,90),box("Jendela",65,65,150,150),box("Kasur",188,269,231,89),box("Bantal",314,244,99,44),box("Kaki ranjang",188,358,25,62),box("Kaki ranjang kanan",394,358,25,62),box("Meja",68,294,89,26)],
  fabric:[box("Kain",70,70,340,340),...Array.from({length:9},(_,i)=>box("Pola "+(i+1),90+(i%3)*100,90+Math.floor(i/3)*100,70,70))],
  stone:[p("Batu besar","M65 331 102 183 225 143 318 252 287 402 123 408Z"),p("Batu kecil","M308 342 345 261 412 278 447 360 391 411 303 395Z")],
  glass:[box("Bingkai kaca",75,65,330,350),p("Bidang kaca kiri","M90 80 270 80 169 248 90 316Z"),p("Bidang kaca kanan","M270 80 390 80 390 291 169 248Z"),p("Bidang kaca bawah","M90 316 169 248 390 291V400H90Z")],
  wood:[box("Papan",68,158,343,146),p("Serat kayu","M82 204 Q168 158 245 210 T398 204 V254 Q315 303 233 254 T82 254Z")],
};

function moved(regions:ColoringRegion[],transform:string,prefix=""):ColoringRegion[] {
  return regions.map(region=>({...region,name:prefix+region.name,transform:transform+(region.transform ? " "+region.transform:"")}));
}
const landscape=[
  box("Langit",24,24,432,432),
  p("Bukit jauh","M24 298 Q118 178 259 286 T456 268V456H24Z"),
  p("Rumput","M24 367Q189 291 456 359V456H24Z")
];
function scene(kind:string):ColoringRegion[] {
  if(motifs[kind]) return motifs[kind];
  switch(kind) {
    case "stripes": return Array.from({length:5},(_,i)=>box("Garis "+(i+1),65,80+i*65,350,55));
    case "dots": case "circles": return Array.from({length:9},(_,i)=>circle("Lingkaran "+(i+1),120+(i%3)*120,120+Math.floor(i/3)*120,43));
    case "checker": case "pattern": return motifs.fabric;
    case "zigzag": return Array.from({length:4},(_,i)=>p("Pola zigzag "+(i+1),`M55 ${85+i*88}l74 35 74-35 74 35 74-35 74 35v48l-74-35-74 35-74-35-74 35-74-35Z`));
    case "balloons": case "party": case "celebrate": return [...moved(balloon,"translate(-30 100) scale(.65)","Balon kiri: "),...moved(balloon,"translate(190 30) scale(.65)","Balon kanan: ")];
    case "forest": case "garden": case "meadow": case "flowers": return [...landscape,...moved(tree,"translate(-5 25) scale(.65)"),...moved(flower,"translate(210 160) scale(.5)")];
    case "leaves": return [...moved(motifs.leaf,"translate(-10 20) scale(.7)","Daun kiri: "),...moved(motifs.leaf,"translate(205 125) scale(.55)","Daun kanan: ")];
    case "ocean": case "pond": return [...landscape,...moved(fish,"translate(70 185) scale(.7)")];
    case "rainy": case "rain-trip": return [...moved([cloud],"translate(50 -5) scale(.8)","Awan hujan: "),...moved(umbrella,"translate(0 130) scale(.75)","Payung: "),...Array.from({length:5},(_,i)=>p("Tetes hujan "+(i+1),`M${85+i*73} 240q-25 40 0 44q25-4 0-44Z`))];
    case "morning": case "noon": case "evening": case "sunset": case "sky": case "cheerful": return [...landscape,...moved(sun,"translate(130 0) scale(.5)")];
    case "night": case "night-camp": case "dreamy": return [...landscape,circle("Bulan",340,114,48),p("Tenda","M90 384 216 208 332 384Z"),p("Pintu tenda","M162 384 216 279 268 384Z")];
    case "calm": return [...landscape,...moved(boat,"translate(95 125) scale(.6)")];
    case "cozy": return motifs.room;
    case "picnic": return [...landscape,...moved(motifs.fabric,"translate(60 270) scale(.65)"),...moved(motifs.apple,"translate(135 165) scale(.4)")];
    case "journey": case "adventure": case "search": case "discovery": return [...landscape,...moved(house,"translate(240 160) scale(.4)"),...moved(cat,"translate(5 190) scale(.45)")];
    case "bus": return [box("Badan bus",50,140,380,206),...Array.from({length:4},(_,i)=>box("Jendela "+(i+1),75+i*85,167,65,70)),circle("Roda kiri",125,350,40),circle("Roda kanan",360,350,40)];
    case "train": return [box("Lokomotif",48,175,150,150),box("Kabin",112,112,100,160),box("Cerobong",62,122,30,53),box("Gerbong",237,194,200,131),...Array.from({length:4},(_,i)=>circle("Roda "+(i+1),86+i*103,343,32))];
    case "teddy": return [circle("Telinga kiri",158,117,40),circle("Telinga kanan",322,117,40),...cat.slice(1,2),circle("Wajah beruang",240,193,110),circle("Moncong",240,242,48),circle("Hidung",240,226,17),circle("Mata kiri",188,185,12),circle("Mata kanan",292,185,12)];
    case "monster": case "creature": return [p("Tubuh","M100 360 112 151 184 85 217 149 307 96 335 164 388 205 371 368Q240 430 100 360Z"),circle("Mata besar",224,224,56),circle("Pupil",224,224,20),circle("Bintik kiri",153,308,21),circle("Bintik kanan",316,324,27)];
    case "dragon": return [...moved(butterfly.slice(0,2),"translate(0 110) scale(1 .7)"),...moved(cat,"translate(75 30) scale(.7)")];
    case "unicorn": return [...cat,p("Tanduk unicorn","M215 119 240 25 263 119Z")];
    case "hero": return [p("Jubah","M163 213 317 213 407 415 71 415Z"),...robot];
    case "chef": return [...robot,{...cloud,transform:"translate(100 -45) scale(.6)"}];
    case "explorer": return [...cat,p("Topi","M111 145H367V171H111Z"),box("Atas topi",166,77,145,69)];
    case "welcome": return [...moved(house,"translate(170 20) scale(.6)"),...moved(cat,"translate(0 160) scale(.55)")];
    case "city": return [...moved(house,"translate(-15 180) scale(.6)"),...moved(rocket,"translate(215 -10) scale(.55)")];
    case "world": return [...landscape,...moved(motifs.castle,"translate(180 90) scale(.55)"),...moved(butterfly,"translate(0 50) scale(.4)")];
  }
  throw new Error("No coloring illustration for "+kind);
}

/**
 * WS-06 authored composition overrides. Wave A covers the former 3+ duplicate
 * groups; Wave B resolves the final ten medium exact-geometry pairs. These are
 * presentation-only variants: activity identity, practice completion, schema,
 * evidence, mastery, and progression stay unchanged.
 */
function highSeverityScene(activityId:string):ColoringRegion[] | null {
  switch(activityId) {
    // Sky/time/mood: use position and supporting objects to make time-of-day readable.
    case "color-scene-sunset":
      return [...landscape,circle("Matahari senja",360,252,54),...moved(bird,"translate(15 80) scale(.28)","Burung senja: ")];
    case "color-neighbor-sky":
      return [box("Langit luas",24,24,432,432),...moved([cloud],"translate(-35 -20) scale(.65)","Awan kiri: "),...moved([cloud],"translate(210 80) scale(.5)","Awan kanan: "),circle("Matahari kecil",382,92,36)];
    case "color-mood-cheerful":
      return [...landscape,...moved(sun,"translate(-40 -15) scale(.43)","Matahari ceria: "),...moved(flower,"translate(210 190) scale(.42)","Bunga ceria: ")];
    case "color-story-morning":
      return [...landscape,...moved(house,"translate(185 170) scale(.5)","Rumah pagi: "),circle("Matahari pagi",92,108,44),...moved([cloud],"translate(180 -20) scale(.45)","Awan pagi: ")];
    case "color-time-morning":
      return [...landscape,circle("Matahari pagi",104,126,50),...moved([cloud],"translate(185 -5) scale(.48)","Awan pagi: ")];
    case "color-time-noon":
      return [...landscape,circle("Matahari siang",240,92,62),...moved([cloud],"translate(-65 35) scale(.42)","Awan siang: ")];
    case "color-time-evening":
      return [...landscape,circle("Matahari sore",370,232,50),...moved(bird,"translate(-10 35) scale(.34)","Burung sore: ")];

    // Robot family: distinguish character, parts, fantasy, material, limited palette, and space role.
    case "color-paca":
      return robot;
    case "color-parts-robot":
      return [
        p("Kepala robot","M120 82 H360 Q390 82 390 112 V218 Q390 248 360 248 H120 Q90 248 90 218 V112 Q90 82 120 82Z"),
        box("Panel badan",150,278,180,110),circle("Mata kiri",185,158,22),circle("Mata kanan",295,158,22),
        box("Lengan kiri",58,292,72,38),box("Lengan kanan",350,292,72,38),circle("Tombol panel",240,332,24)
      ];
    case "color-fantasy-robot":
      return [...moved(robot,"translate(28 28) scale(.86)","Robot fantasi: "),{...star,name:"Bintang robot",transform:"translate(325 30) scale(.22)"},circle("Orb fantasi",72,106,28)];
    case "color-material-metal":
      return [...moved(robot,"translate(48 55) scale(.78)","Robot metal: "),...Array.from({length:4},(_,i)=>circle("Rivet "+(i+1),116+i*82,410,12))];
    case "color-limited-three-robot":
      return [
        p("Kepala robot","M135 88 H345 Q372 88 372 120 V220 Q372 252 345 252 H135 Q108 252 108 220 V120 Q108 88 135 88Z"),
        p("Badan robot","M155 265 H325 Q350 265 350 300 V395 H130 V300 Q130 265 155 265Z"),
        p("Kaki dan tangan","M70 290 H130 V336 H70Z M350 290 H410 V336 H350Z M160 395 H218 V438 H145Z M262 395 H320 L335 438 H262Z")
      ];
    case "color-character-space":
      return [...moved(robot,"translate(82 92) scale(.64)","Astronaut robot: "),...moved(motifs.space,"translate(-55 -30) scale(.55)","Ruang angkasa: "),circle("Bulan kecil",402,360,34)];

    // Adventure/search/journey/discovery: each scene communicates a different action.
    case "color-mood-adventure":
      return [...landscape,p("Gunung petualangan","M45 365 172 155 292 365Z"),...moved(cat,"translate(245 220) scale(.38)","Penjelajah: ")];
    case "color-scene-search":
      return [...landscape,...moved(motifs.sign,"translate(215 170) scale(.45)","Petunjuk: "),...moved(cat,"translate(-5 205) scale(.43)","Pencari: "),circle("Lensa pencarian",404,104,38)];
    case "color-scene-journey":
      return [...landscape,p("Jalan perjalanan","M182 456 230 278 284 278 350 456Z"),...moved(car,"translate(80 160) scale(.55)","Mobil perjalanan: ")];
    case "color-scene-discovery":
      return [...landscape,box("Peti penemuan",118,302,190,92),p("Tutup peti","M105 302 Q213 225 320 302Z"),{...star,name:"Bintang penemuan",transform:"translate(250 25) scale(.32)"},...moved(butterfly,"translate(285 190) scale(.3)","Kupu-kupu: ")];

    // Meadow/forest/flowers/fantasy garden: authored density and focal objects differ.
    case "color-scene-meadow":
      return [...landscape,...moved(flower,"translate(-20 190) scale(.42)","Bunga kiri: "),...moved(flower,"translate(225 210) scale(.38)","Bunga kanan: ")];
    case "color-scene-forest":
      return [...landscape,...moved(tree,"translate(-55 70) scale(.65)","Pohon kiri: "),...moved(tree,"translate(195 120) scale(.52)","Pohon kanan: ")];
    case "color-neighbor-flowers":
      return [...moved(flower,"translate(-15 45) scale(.72)","Bunga besar: "),...moved(flower,"translate(225 170) scale(.45)","Bunga kecil: ")];
    case "color-capstone-fantasy-garden":
      return [...landscape,...moved(tree,"translate(-55 90) scale(.58)","Pohon fantasi: "),...moved(flower,"translate(215 190) scale(.38)","Bunga fantasi: "),...moved(butterfly,"translate(170 20) scale(.28)","Kupu-kupu fantasi: ")];

    // Night family: separate dreamy sky, camping story, and pure time-of-day scene.
    case "color-mood-dreamy":
      return [box("Langit mimpi",24,24,432,432),circle("Bulan mimpi",330,116,58),...moved([cloud],"translate(-25 75) scale(.62)","Awan mimpi: "),{...star,name:"Bintang mimpi",transform:"translate(35 20) scale(.24)"}];
    case "color-story-night-camp":
      return [...landscape,circle("Bulan kemah",365,92,42),p("Tenda kemah","M82 402 210 205 338 402Z"),p("Pintu tenda","M160 402 210 295 260 402Z"),p("Api unggun","M357 390 389 315 420 390Z")];
    case "color-time-night":
      return [box("Langit malam",24,24,432,432),circle("Bulan malam",338,120,54),{...star,name:"Bintang kiri",transform:"translate(20 25) scale(.24)"},{...star,name:"Bintang kanan",transform:"translate(270 115) scale(.18)"}];

    // Flower family: object, two-color exercise, and free-palette capstone get different complexity.
    case "color-object-flower":
      return flower;
    case "color-limited-two-flower":
      return [p("Kelopak bunga","M240 72 C305 72 335 130 304 177 C354 196 352 268 298 286 C287 345 212 345 191 288 C126 281 117 210 167 180 C137 125 176 72 240 72Z"),p("Batang dan daun","M228 284 H252 V426 H228Z M229 357 Q133 357 132 301 Q206 291 229 357Z M251 334 Q328 325 351 274 Q274 274 251 334Z")];
    case "color-capstone-free-palette":
      return [...moved(flower,"translate(-70 135) scale(.55)","Bunga kiri: "),...moved(flower,"translate(120 40) scale(.72)","Bunga tengah: "),...moved(flower,"translate(290 170) scale(.42)","Bunga kanan: ")];

    // Fish family: single fish, a pair, and a simplified three-region exercise.
    case "color-palette-fish":
      return fish;
    case "color-neighbor-fish":
      return [...moved(fish,"translate(-15 35) scale(.62)","Ikan kiri: "),...moved(fish,"translate(225 185) scale(.42)","Ikan kanan: ")];
    case "color-limited-three-fish":
      return [p("Badan ikan","M70 244 Q175 105 344 229 Q192 384 70 244Z"),p("Ekor ikan","M329 229 421 151 407 316Z"),p("Sirip ikan","M183 205 Q275 204 246 302Z")];

    // Pattern/fabric family: checker, material study, and limited pattern are distinct tasks.
    case "color-pattern-checker":
      return Array.from({length:16},(_,i)=>box("Kotak "+(i+1),80+(i%4)*80,80+Math.floor(i/4)*80,72,72));
    case "color-material-fabric":
      return [box("Kain utama",60,70,360,340),...Array.from({length:5},(_,i)=>box("Pita kain "+(i+1),82,100+i*58,316,34)),...Array.from({length:4},(_,i)=>box("Jalur tenun "+(i+1),116+i*72,88,28,304))];
    case "color-limited-three-pattern":
      return [p("Pola atas","M55 95 130 130 205 95 280 130 355 95 425 130V190L355 155 280 190 205 155 130 190 55 155Z"),p("Pola tengah","M55 215 130 250 205 215 280 250 355 215 425 250V310L355 275 280 310 205 275 130 310 55 275Z"),p("Pola bawah","M55 335 130 370 205 335 280 370 355 335 425 370V430H55Z")];

    // Rain family: umbrella play, travel story, and rainy-season landscape are visibly separate.
    case "color-scene-rainy":
      return [...moved([cloud],"translate(50 -5) scale(.8)","Awan hujan: "),...moved(umbrella,"translate(0 130) scale(.75)","Payung: "),...Array.from({length:5},(_,i)=>p("Tetes hujan "+(i+1),`M${85+i*73} 240q-25 40 0 44q25-4 0-44Z`))];
    case "color-story-rain-trip":
      return [...moved([cloud],"translate(90 -35) scale(.7)","Awan perjalanan: "),...moved(scene("bus"),"translate(60 125) scale(.72)","Bus hujan: "),p("Genangan","M64 423 Q190 385 318 423 Q188 458 64 423Z")];
    case "color-season-rainy":
      return [...landscape,...moved([cloud],"translate(-60 -20) scale(.58)","Awan kiri: "),...moved([cloud],"translate(190 40) scale(.5)","Awan kanan: "),...Array.from({length:7},(_,i)=>p("Tetes musim "+(i+1),`M${55+i*60} 210q-18 31 0 36q18-5 0-36Z`)),p("Genangan musim","M82 421 Q238 365 398 421 Q242 465 82 421Z")];

    // Celebration family: color-pair balloons, party props, and celebration confetti differ.
    case "color-warm-cool-balloons":
      return [...moved(balloon,"translate(-30 100) scale(.65)","Balon hangat: "),...moved(balloon,"translate(190 30) scale(.65)","Balon sejuk: ")];
    case "color-story-party":
      return [...moved(balloon,"translate(-65 40) scale(.45)","Balon kiri: "),...moved(balloon,"translate(105 5) scale(.5)","Balon tengah: "),...moved(balloon,"translate(270 65) scale(.4)","Balon kanan: "),box("Meja pesta",115,355,250,70),p("Kue pesta","M175 355 H305 V302 H175Z")];
    case "color-scene-celebrate":
      return [...moved(balloon,"translate(-35 70) scale(.48)","Balon kiri: "),...moved(balloon,"translate(245 60) scale(.48)","Balon kanan: "),p("Banner perayaan","M70 90 Q240 165 410 90 V132 Q240 207 70 132Z"),...Array.from({length:5},(_,i)=>circle("Konfeti "+(i+1),95+i*72,292+(i%2)*45,12))];

    // WS-06 Wave B: resolve the final ten exact-geometry pairs with contextual variants.
    case "color-parts-cat":
      return [
        p("Kepala kucing","M125 145 Q145 80 240 82 Q335 80 355 145 Q370 235 240 250 Q110 235 125 145Z"),
        p("Telinga kiri","M137 136 132 60 198 112Z"),p("Telinga kanan","M282 112 348 60 343 136Z"),
        p("Badan kucing","M170 282 Q240 248 310 282 L328 398 Q240 430 152 398Z"),
        p("Ekor kucing","M319 337 C403 375 421 270 372 274 C400 304 359 338 323 315Z"),
        circle("Mata kiri",195,165,14),circle("Mata kanan",285,165,14),p("Hidung","M225 205 240 222 255 205Z")
      ];
    case "color-contrast-umbrella":
      return [
        p("Kanopi kiri","M65 236 Q95 105 240 108 V236 Q190 198 153 236 Q109 202 65 236Z"),
        p("Kanopi kanan","M240 108 Q385 105 415 236 Q371 202 327 236 Q290 198 240 236Z"),
        p("Pegangan","M233 236 H247 V365 Q246 424 190 410 Q160 400 170 373 H185 Q180 398 214 390 Q233 386 233 362Z"),
        p("Tetes kiri","M118 286 Q91 327 118 342 Q145 327 118 286Z"),p("Tetes kanan","M363 286 Q336 327 363 342 Q390 327 363 286Z")
      ];
    case "color-limited-two-house":
      return [p("Atap rumah","M70 225 240 72 410 225Z"),p("Badan rumah","M112 225 H368 V410 H112Z")];
    case "color-transport-car":
      return [p("Jalan","M35 360 Q240 320 445 360 V442 H35Z"),...moved(car,"translate(42 90) scale(.82)","Mobil jalan: ")];
    case "color-contrast-kite":
      return [
        p("Layang kiri","M240 62 98 214 240 357Z"),p("Layang kanan","M240 62 382 214 240 357Z"),
        p("Ekor layang","M237 357 H245 V444 H237Z"),p("Pita atas","M206 376 240 392 274 376 258 410 222 410Z"),p("Pita bawah","M206 414 240 430 274 414 258 448 222 448Z")
      ];
    case "color-warm-sun":
      return [
        p("Sinar matahari","M240 42 260 102 220 102Z M240 438 260 378 220 378Z M42 240 102 220 102 260Z M438 240 378 220 378 260Z M99 99 151 127 127 151Z M381 99 353 151 329 127Z M99 381 127 329 151 353Z M381 381 329 353 353 329Z"),
        circle("Matahari hangat",240,240,112),circle("Pusat hangat",240,240,62)
      ];
    case "color-scene-pond":
      return [
        p("Kolam","M52 342 C94 255 384 248 430 342 C382 431 96 431 52 342Z"),
        p("Daun teratai","M104 324 Q151 279 205 320 Q167 364 104 324Z"),circle("Bunga teratai",163,301,22),
        ...moved(fish,"translate(152 242) scale(.32)","Ikan kolam: ")
      ];
    case "color-pattern-circles":
      return [circle("Lingkaran luar",240,240,170),circle("Lingkaran tengah",240,240,118),circle("Lingkaran dalam",240,240,66),circle("Lingkaran kiri",88,88,34),circle("Lingkaran kanan",392,392,34)];
    case "color-character-creature":
      return [
        p("Tubuh makhluk","M116 352 Q86 185 155 120 Q240 54 325 120 Q394 185 364 352 Q240 430 116 352Z"),
        p("Telinga kiri","M150 145 116 62 205 114Z"),p("Telinga kanan","M275 114 364 62 330 145Z"),
        circle("Mata kiri",190,220,28),circle("Mata kanan",290,220,28),circle("Bintik satu",169,319,24),circle("Bintik dua",310,327,31),p("Senyum","M205 272 Q240 305 275 272 Q240 331 205 272Z")
      ];
    case "color-capstone-dream-room":
      return [
        ...motifs.room,
        p("Karpet mimpi","M132 394 Q240 345 350 394 Q240 442 132 394Z"),
        p("Lampu tidur","M92 292 H128 V363 H92Z M72 292 110 226 148 292Z"),
        circle("Bulan jendela",140,137,35),{...star,name:"Bintang kamar",transform:"translate(260 35) scale(.22)"}
      ];
  }
  return null;
}

export function coloringScene(activityId:string):ColoringRegion[] {
  const authored=highSeverityScene(activityId);
  if(authored) return authored;
  if(activityId==="color-paca") return robot;
  if(activityId==="color-gavi") return cat;
  const id=activityId.replace(/^color-/,"");
  const special:Record<string,string>={"fantasy-robot":"robot","material-metal":"robot","character-space":"robot","limited-three-pattern":"pattern","capstone-dream-room":"room","capstone-fantasy-garden":"garden","capstone-future-city":"city","capstone-story-world":"world","capstone-free-palette":"flower","character-creature":"creature","warm-cool-balloons":"balloons"};
  if(special[id]) return scene(special[id]);
  const kind=id.replace(/^(shape|object|palette|nature|parts|warm|cool|pattern|scene|transport|fantasy|neighbor|contrast|mood|material|story|time|season|character)-/,"").replace(/^limited-(two|three)-/,"");
  return scene(kind);
}