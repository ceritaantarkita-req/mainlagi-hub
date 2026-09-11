import type {
  CreativeBatch14ActivitySeed,
  CreativeBatch14ColoringSeed,
  CreativeBatch14DrawingSeed,
  CreativeBatch14WaveDefinition
} from "./creativeBatch14Authoring";

const DRAW_STAGE = "drawing-lines-shapes-basics";
const COLOR_STAGE = "color-exploration-basics";

type DrawingTask = readonly [slug: string, title: string, emoji: string, prompt: string, guide: string, difficulty: 1 | 2 | 3];
type ColoringTask = readonly [slug: string, title: string, emoji: string, prompt: string, character: string, regions: readonly string[], difficulty: 1 | 2 | 3];

function drawingSeeds(args: {
  packId: string;
  lessonId: string;
  skillId: string;
  tasks: readonly DrawingTask[];
}): CreativeBatch14DrawingSeed[] {
  return args.tasks.map((task, index) => ({
    kind: "drawing",
    id: `drawing-${task[0]}`,
    subjectId: "drawing",
    stageId: DRAW_STAGE,
    packId: args.packId,
    lessonId: args.lessonId,
    title: task[1],
    description: `Latihan menggambar ${task[1].toLowerCase()} dengan kanvas sentuh.`,
    emoji: task[2],
    ageMin: task[5] === 1 ? 3 : 4,
    ageMax: 7,
    difficulty: task[5],
    requiredForStage: index === 0,
    skillId: args.skillId,
    creativePrompt: task[3],
    drawingGuide: task[4]
  }));
}

function coloringSeeds(args: {
  packId: string;
  lessonId: string;
  skillId: string;
  tasks: readonly ColoringTask[];
}): CreativeBatch14ColoringSeed[] {
  return args.tasks.map((task, index) => ({
    kind: "coloring",
    id: `color-${task[0]}`,
    subjectId: "color",
    stageId: COLOR_STAGE,
    packId: args.packId,
    lessonId: args.lessonId,
    title: task[1],
    description: `Eksplorasi warna pada ${task[1].toLowerCase()} tanpa jawaban benar-salah.`,
    emoji: task[2],
    ageMin: task[6] === 1 ? 3 : 4,
    ageMax: 7,
    difficulty: task[6],
    requiredForStage: index === 0,
    skillId: args.skillId,
    creativePrompt: task[3],
    coloringCharacter: task[4],
    coloringRegions: [...task[5]]
  }));
}

const ACTIVITIES: CreativeBatch14ActivitySeed[] = [
  ...drawingSeeds({
    packId: "drawing.pack.lines-basic",
    lessonId: "drawing-lines-basic",
    skillId: "drawing.line.control.basic",
    tasks: [
      ["line-vertical", "Garis tegak", "↕️", "Tarik garis dari atas ke bawah.", "│", 1],
      ["line-horizontal", "Garis mendatar", "↔️", "Tarik garis dari kiri ke kanan.", "─", 1],
      ["line-diagonal-up", "Garis miring naik", "📈", "Tarik garis miring dari kiri bawah ke kanan atas.", "╱", 1],
      ["line-diagonal-down", "Garis miring turun", "📉", "Tarik garis miring dari kiri atas ke kanan bawah.", "╲", 1],
      ["line-zigzag", "Garis zigzag", "⚡", "Ikuti jalur zigzag dari kiri ke kanan.", "〽", 2]
    ]
  }),
  ...drawingSeeds({
    packId: "drawing.pack.curves-basic",
    lessonId: "drawing-curves-basic",
    skillId: "drawing.curve.control.basic",
    tasks: [
      ["curve-wave", "Garis ombak", "🌊", "Buat garis naik-turun seperti ombak.", "∿", 1],
      ["curve-arch", "Lengkung pelangi", "🌈", "Buat satu lengkung besar seperti pelangi.", "⌒", 1],
      ["curve-bowl", "Lengkung mangkuk", "🥣", "Buat lengkung terbuka ke atas.", "⌣", 1],
      ["curve-spiral", "Spiral", "🌀", "Putar garis menuju tengah seperti spiral.", "🌀", 2],
      ["curve-loop", "Lingkar berulang", "➰", "Buat dua loop yang tersambung.", "∞", 2]
    ]
  }),
  ...drawingSeeds({
    packId: "drawing.pack.shapes-basic",
    lessonId: "drawing-shapes-basic",
    skillId: "drawing.shape.construction.basic",
    tasks: [
      ["shape-circle", "Lingkaran", "⭕", "Buat lingkaran penuh dan kembali ke titik awal.", "○", 1],
      ["shape-square", "Persegi", "⬜", "Buat empat sisi persegi.", "□", 1],
      ["shape-triangle", "Segitiga", "🔺", "Buat tiga sisi segitiga.", "△", 1],
      ["shape-rectangle", "Persegi panjang", "▭", "Buat persegi panjang dengan sisi atas-bawah lebih panjang.", "▭", 2],
      ["shape-diamond", "Belah ketupat", "🔷", "Hubungkan empat sudut menjadi bentuk wajik.", "◇", 2]
    ]
  }),
  ...drawingSeeds({
    packId: "drawing.pack.connect-dots-basic",
    lessonId: "drawing-connect-dots-basic",
    skillId: "drawing.connect_dots.basic",
    tasks: [
      ["dots-star", "Hubungkan titik bintang", "⭐", "Hubungkan titik-titik hingga membentuk bintang sederhana.", "• ☆ •", 2],
      ["dots-house", "Hubungkan titik rumah", "🏠", "Hubungkan titik sudut hingga menjadi rumah sederhana.", "•⌂•", 2],
      ["dots-fish", "Hubungkan titik ikan", "🐟", "Hubungkan titik mengikuti bentuk ikan.", "•<><•", 2],
      ["dots-kite", "Hubungkan titik layang-layang", "🪁", "Hubungkan empat titik utama layang-layang.", "•◇•", 2],
      ["dots-flower", "Hubungkan titik bunga", "🌼", "Hubungkan titik kelopak mengelilingi bagian tengah.", "•✿•", 3]
    ]
  }),
  ...drawingSeeds({
    packId: "drawing.pack.simple-composition",
    lessonId: "drawing-simple-composition",
    skillId: "drawing.simple_composition.basic",
    tasks: [
      ["compose-sun-rays", "Tambahkan sinar matahari", "☀️", "Gambar beberapa garis keluar dari matahari.", "☀", 1],
      ["compose-tree-branches", "Tambahkan cabang pohon", "🌳", "Gambar cabang yang keluar dari batang pohon.", "│Y", 2],
      ["compose-face-features", "Lengkapi wajah", "🙂", "Tambahkan mata dan mulut pada wajah sederhana.", "◯", 2],
      ["compose-rain-lines", "Gambar hujan", "🌧️", "Tambahkan beberapa garis hujan dari awan ke bawah.", "☁", 1],
      ["compose-road-path", "Buat jalan", "🛣️", "Gambar dua garis yang membentuk jalan menuju tujuan.", "⌇⌇", 3]
    ]
  }),
  ...coloringSeeds({
    packId: "color.pack.large-shapes",
    lessonId: "color-large-shapes",
    skillId: "color.large_shapes.exploration",
    tasks: [
      ["shape-circle", "Lingkaran besar", "⭕", "Warnai semua bagian lingkaran dengan warna pilihanmu.", "⭕", ["◉", "○", "●"], 1],
      ["shape-square", "Persegi besar", "⬜", "Coba tiga warna berbeda pada bagian persegi.", "⬜", ["▣", "□", "■"], 1],
      ["shape-triangle", "Segitiga besar", "🔺", "Warnai bagian segitiga dari bawah ke atas.", "🔺", ["△", "▲", "▽"], 1],
      ["shape-star", "Bintang", "⭐", "Beri warna pada bagian-bagian bintang.", "⭐", ["☆", "★", "✦"], 1],
      ["shape-heart", "Hati", "💗", "Pilih warna yang kamu suka untuk setiap bagian hati.", "💗", ["♡", "♥", "💟"], 1]
    ]
  }),
  ...coloringSeeds({
    packId: "color.pack.basic-objects",
    lessonId: "color-basic-objects",
    skillId: "color.basic_objects.exploration",
    tasks: [
      ["object-ball", "Bola", "⚽", "Warnai panel-panel bola dengan kombinasi yang berbeda.", "⚽", ["◐", "◑", "◒", "◓"], 1],
      ["object-apple", "Apel", "🍎", "Warnai buah, daun, dan tangkainya.", "🍎", ["🍏", "🍃", "〽"], 1],
      ["object-umbrella", "Payung", "☂️", "Buat payung cerah dengan beberapa warna.", "☂️", ["◡", "│", "J"], 2],
      ["object-house", "Rumah", "🏠", "Warnai atap, dinding, pintu, dan jendela.", "🏠", ["△", "□", "▯", "▫"], 2],
      ["object-flower", "Bunga", "🌼", "Warnai kelopak, tengah bunga, dan batang.", "🌼", ["✿", "●", "│", "🍃"], 2]
    ]
  }),
  ...coloringSeeds({
    packId: "color.pack.palette-play",
    lessonId: "color-palette-play",
    skillId: "color.palette.exploration.basic",
    tasks: [
      ["palette-balloon", "Balon", "🎈", "Coba warna berbeda untuk balon dan talinya.", "🎈", ["◯", "│", "🎀"], 1],
      ["palette-fish", "Ikan", "🐟", "Warnai badan, sirip, dan ekor ikan.", "🐟", ["◉", "◁", "▷", "≋"], 2],
      ["palette-car", "Mobil", "🚗", "Warnai badan mobil, kaca, dan rodanya.", "🚗", ["▭", "▫", "●", "●"], 2],
      ["palette-cup", "Cangkir", "☕", "Warnai badan cangkir, gagang, dan alasnya.", "☕", ["▱", "C", "━"], 1],
      ["palette-kite", "Layang-layang", "🪁", "Gunakan beberapa warna pada badan dan ekornya.", "🪁", ["◇", "╲", "🎀", "🎀"], 2]
    ]
  }),
  ...coloringSeeds({
    packId: "color.pack.simple-nature",
    lessonId: "color-simple-nature",
    skillId: "color.nature.exploration.basic",
    tasks: [
      ["nature-sun", "Matahari", "☀️", "Warnai pusat dan sinar matahari.", "☀️", ["●", "✦", "✦", "✦"], 1],
      ["nature-cloud", "Awan", "☁️", "Beri warna lembut pada beberapa bagian awan.", "☁️", ["☁", "◌", "◌"], 1],
      ["nature-tree", "Pohon", "🌳", "Warnai daun, batang, dan tanah di bawah pohon.", "🌳", ["♣", "▮", "▁", "🍃"], 2],
      ["nature-leaf", "Daun", "🍃", "Coba warna pada bidang kiri, kanan, dan tulang daun.", "🍃", ["◖", "◗", "│"], 2]
    ]
  }),
  ...coloringSeeds({
    packId: "color.pack.character-parts",
    lessonId: "color-character-parts",
    skillId: "color.character_parts.exploration",
    tasks: [
      ["parts-cat", "Kucing", "🐱", "Warnai kepala, badan, ekor, dan aksesorinya.", "🐱", ["◯", "⬭", "〰", "🎀"], 2],
      ["parts-robot", "Robot", "🤖", "Warnai kepala, badan, tombol, dan kaki robot.", "🤖", ["▣", "▭", "●", "▯"], 2],
      ["parts-teddy", "Boneka beruang", "🧸", "Warnai telinga, wajah, badan, dan kaki boneka.", "🧸", ["◉", "◯", "⬭", "◡"], 2],
      ["parts-butterfly", "Kupu-kupu", "🦋", "Gunakan warna berbeda pada sayap kiri, kanan, dan badan.", "🦋", ["◖", "◗", "│", "•"], 2]
    ]
  })
];

export const CREATIVE_BATCH14_WAVE_A: CreativeBatch14WaveDefinition = {
  wave: "A",
  stages: [
    { id: DRAW_STAGE, subjectId: "drawing", title: "Garis, Bentuk & Jalur", subtitle: "Mulai menggambar lewat garis, lengkung, bentuk, titik, dan komposisi sederhana.", emoji: "✏️" },
    { id: COLOR_STAGE, subjectId: "color", title: "Eksplorasi Warna Dasar", subtitle: "Warnai bentuk dan objek sederhana melalui beberapa bagian yang bisa disentuh.", emoji: "🎨" }
  ],
  lessons: [
    { id: "drawing-lines-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Garis Dasar", objective: "Menggerakkan jari dalam beberapa arah garis dasar.", ageMin: 3, ageMax: 7 },
    { id: "drawing-curves-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Garis Lengkung", objective: "Mencoba kontrol gerak melengkung, bergelombang, dan berputar.", ageMin: 3, ageMax: 7 },
    { id: "drawing-shapes-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Bentuk Dasar", objective: "Membangun bentuk sederhana dari beberapa garis.", ageMin: 3, ageMax: 7 },
    { id: "drawing-connect-dots-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Hubungkan Titik", objective: "Mengikuti urutan visual dan menghubungkan beberapa titik menjadi bentuk.", ageMin: 4, ageMax: 7 },
    { id: "drawing-simple-composition", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Lengkapi Gambar", objective: "Menambahkan beberapa goresan untuk melengkapi ide gambar sederhana.", ageMin: 3, ageMax: 7 },
    { id: "color-large-shapes", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Bentuk Besar", objective: "Mengeksplorasi warna pada bentuk sederhana dengan area sentuh besar.", ageMin: 3, ageMax: 7 },
    { id: "color-basic-objects", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Objek Sehari-hari", objective: "Mencoba warna pada bagian-bagian objek yang mudah dikenali.", ageMin: 3, ageMax: 7 },
    { id: "color-palette-play", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Main Palet", objective: "Mencoba kombinasi beberapa warna pada objek sederhana.", ageMin: 3, ageMax: 7 },
    { id: "color-simple-nature", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Alam Sederhana", objective: "Mewarnai bagian sederhana dari benda-benda alam.", ageMin: 3, ageMax: 7 },
    { id: "color-character-parts", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Bagian Karakter", objective: "Mencoba warna berbeda pada beberapa bagian karakter dan hewan.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "drawing.pack.lines-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Basic Lines", lessonId: "drawing-lines-basic", ageMin: 3, ageMax: 7 },
    { id: "drawing.pack.curves-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Basic Curves", lessonId: "drawing-curves-basic", ageMin: 3, ageMax: 7 },
    { id: "drawing.pack.shapes-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Basic Shapes", lessonId: "drawing-shapes-basic", ageMin: 3, ageMax: 7 },
    { id: "drawing.pack.connect-dots-basic", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Connect the Dots", lessonId: "drawing-connect-dots-basic", ageMin: 4, ageMax: 7 },
    { id: "drawing.pack.simple-composition", subjectId: "drawing", pathId: "drawing-creative-studio", stageId: DRAW_STAGE, title: "Simple Composition", lessonId: "drawing-simple-composition", ageMin: 3, ageMax: 7 },
    { id: "color.pack.large-shapes", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Large Shapes", lessonId: "color-large-shapes", ageMin: 3, ageMax: 7 },
    { id: "color.pack.basic-objects", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Basic Objects", lessonId: "color-basic-objects", ageMin: 3, ageMax: 7 },
    { id: "color.pack.palette-play", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Palette Play", lessonId: "color-palette-play", ageMin: 3, ageMax: 7 },
    { id: "color.pack.simple-nature", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Simple Nature", lessonId: "color-simple-nature", ageMin: 3, ageMax: 7 },
    { id: "color.pack.character-parts", subjectId: "color", pathId: "color-creative-play", stageId: COLOR_STAGE, title: "Character Parts", lessonId: "color-character-parts", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "drawing.line.control.basic", subjectId: "drawing", title: "Kontrol garis dasar", description: "Berlatih arah garis dasar dengan gerak jari di kanvas.", domain: "motor", ageMin: 3, ageMax: 7 },
    { id: "drawing.curve.control.basic", subjectId: "drawing", title: "Kontrol garis lengkung", description: "Berlatih membuat garis melengkung, bergelombang, dan berputar.", domain: "motor", ageMin: 3, ageMax: 7 },
    { id: "drawing.shape.construction.basic", subjectId: "drawing", title: "Membangun bentuk dasar", description: "Berlatih menyusun garis menjadi bentuk dasar.", domain: "creative", ageMin: 3, ageMax: 7 },
    { id: "drawing.connect_dots.basic", subjectId: "drawing", title: "Menghubungkan titik", description: "Mengikuti petunjuk visual sederhana untuk menghubungkan titik menjadi bentuk.", domain: "motor", ageMin: 4, ageMax: 7 },
    { id: "drawing.simple_composition.basic", subjectId: "drawing", title: "Komposisi gambar sederhana", description: "Menambahkan goresan sederhana untuk melengkapi sebuah gambar.", domain: "creative", ageMin: 3, ageMax: 7 },
    { id: "color.large_shapes.exploration", subjectId: "color", title: "Eksplorasi warna pada bentuk", description: "Mencoba pilihan warna pada beberapa bagian bentuk besar.", domain: "creative", ageMin: 3, ageMax: 7 },
    { id: "color.basic_objects.exploration", subjectId: "color", title: "Eksplorasi warna objek", description: "Mencoba warna pada bagian-bagian objek yang familiar.", domain: "creative", ageMin: 3, ageMax: 7 },
    { id: "color.palette.exploration.basic", subjectId: "color", title: "Eksplorasi palet dasar", description: "Mencoba kombinasi beberapa warna dalam satu aktivitas.", domain: "creative", ageMin: 3, ageMax: 7 },
    { id: "color.nature.exploration.basic", subjectId: "color", title: "Eksplorasi warna alam", description: "Mencoba warna pada bentuk-bentuk alam sederhana.", domain: "creative", ageMin: 3, ageMax: 7 },
    { id: "color.character_parts.exploration", subjectId: "color", title: "Eksplorasi bagian karakter", description: "Mencoba warna berbeda pada beberapa bagian karakter atau hewan.", domain: "creative", ageMin: 4, ageMax: 7 }
  ],
  activities: ACTIVITIES
};
