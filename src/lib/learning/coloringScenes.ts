/**
 * Presentation-only vector artwork. Does not change catalog, assessment,
 * completion, evidence, or progression. Regions are spatial shapes, not labels.
 */
export interface ColoringRegion { name: string; path: string; transform?: string }
const p = (name: string, path: string): ColoringRegion => ({name,path});
const circle = (name:string,x:number,y:number,r:number) => p(name,`M ${x-r} ${y} a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 ${-r*2} 0 Z`);
const box = (name:string,x:number,y:number,w:number,h:number) => p(name,`M${x} ${y} h${w} v${h} h${-w}Z`);
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
    case "rainy": case "rain-trip": return [...moved([cloud],"translate(50 -5) scale(.8)"),...moved(umbrella,"translate(0 130) scale(.75)"),...Array.from({length:5},(_,i)=>p("Tetes hujan "+(i+1),`M${85+i*73} 240q-25 40 0 44q25-4 0-44Z`))];
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

export function coloringScene(activityId:string):ColoringRegion[] {
  if(activityId==="color-paca") return robot;
  if(activityId==="color-gavi") return cat;
  const id=activityId.replace(/^color-/,"");
  const special:Record<string,string>={"fantasy-robot":"robot","material-metal":"robot","character-space":"robot","limited-three-pattern":"pattern","capstone-dream-room":"room","capstone-fantasy-garden":"garden","capstone-future-city":"city","capstone-story-world":"world","capstone-free-palette":"flower","character-creature":"creature","warm-cool-balloons":"balloons"};
  if(special[id]) return scene(special[id]);
  const kind=id.replace(/^(shape|object|palette|nature|parts|warm|cool|pattern|scene|transport|fantasy|neighbor|contrast|mood|material|story|time|season|character)-/,"").replace(/^limited-(two|three)-/,"");
  return scene(kind);
}
