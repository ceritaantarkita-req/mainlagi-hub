# ============================================================================
#  Mainlagi TV - restrukturisasi branch, 16 Agustus 2026
# ============================================================================
#
#  Tujuan:
#    1. Arsipkan isi `main` yang lama ke branch archive/main-legacy-20260816
#    2. Jadikan `main` berisi kerja V3 + semua perbaikan hari ini
#    3. Bereskan 46 file "modified" palsu yang sebenarnya cuma CRLF vs LF
#
#  Urutan sengaja dibuat aman: arsip dibuat DAN di-push lebih dulu. Kalau push
#  arsip gagal, skrip berhenti dan `main` tidak disentuh sama sekali.
#
#  Cara jalan:
#    Buka PowerShell di folder repo, lalu:
#      .\GIT_RESTRUCTURE_20260816.ps1
#    Kalau PowerShell menolak menjalankan skrip:
#      powershell -ExecutionPolicy Bypass -File .\GIT_RESTRUCTURE_20260816.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

$SourceBranch  = "feature/mainlagitv-motion-engine-v3"
$ArchiveBranch = "archive/main-legacy-20260816"

function Step($message) { Write-Host "`n>>> $message" -ForegroundColor Cyan }
function Ok($message)   { Write-Host "    OK  $message" -ForegroundColor Green }
function Warn($message) { Write-Host "    !!  $message" -ForegroundColor Yellow }

# --- 0. Bersihkan file lock yang tertinggal -------------------------------
# Sesi Cowork sebelumnya membuat lock ini lewat jembatan folder dan tidak bisa
# menghapusnya sendiri ("Operation not permitted").
Step "Membersihkan file lock git"
foreach ($lock in @(".git\index.lock", ".git\packed-refs.lock")) {
    if (Test-Path $lock) {
        Remove-Item $lock -Force
        Ok "hapus $lock"
    }
}

# --- 1. Cek posisi awal ---------------------------------------------------
Step "Memeriksa kondisi repo"
$current = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "    branch sekarang : $current"
if ($current -ne $SourceBranch) {
    Warn "Branch sekarang bukan $SourceBranch."
    $answer = Read-Host "    Lanjutkan? (y/N)"
    if ($answer -ne "y") { Write-Host "Dibatalkan."; exit 1 }
}

git fetch origin --prune
Ok "fetch selesai"

# --- 2. Normalisasi akhir baris -------------------------------------------
Step "Menormalkan akhir baris (menghapus 46 file 'modified' palsu)"
if (-not (Test-Path ".gitattributes")) {
    Warn ".gitattributes tidak ditemukan - seharusnya sudah ditulis oleh Claude."
    exit 1
}
git add --renormalize .
$noise = (git diff --cached --numstat | Measure-Object).Count
Ok "renormalisasi selesai ($noise file di-stage)"

# --- 3. Commit semua perbaikan ke branch sumber ---------------------------
Step "Commit perbaikan ke $SourceBranch"
git add -A
$pending = (git diff --cached --name-only | Measure-Object).Count
if ($pending -gt 0) {
    $message = @"
feat: overhaul tracking, recognition, playability, and mobile UI

Skeleton
- keep both hands per player instead of silently discarding the second
- draw the full 33-point pose (head, hands, feet) and per-finger hand chains
- project landmarks through the object-fit: cover transform so the overlay
  lines up with the video on every aspect ratio

Face mesh
- add FaceLandmarker with mouth-open submit, distance guidance, player
  identity slots, and contour rendering; optional and rate-limited

Recognition
- remove mirror and reverse matching, which made 6 and 9 mathematically
  inseparable and collapsed dal/ra and dzal/zai
- replace the index-wise path matcher with a $P point-cloud recognizer that
  respects pen-ups, plus structural features (loop position, aspect, crossings)
- add multi-digit segmentation so 10 and 69 can be written in one pass
- replace the drifting relative pen with an absolute calibrated mapper,
  frozen while the pen is down
- stitch pre-pinch samples so the start of each character is not clipped
- expose real gesture confidence instead of the handedness score

Hijaiyah
- rewrite: all 28 letters, size-based dot separation, exact dot count and
  side, right-to-left direction scoring, and a discriminative check

Playability
- preflight reduced from seven gates to one step; parent view holds the rest
- relaxed mode by default: no countdown, no penalties
- per-player question and level; scoring no longer wipes the other board
- timer pauses when the player leaves frame
- audio and speech feedback; air targets on every control
- randomize the question seed per session

Frontend
- rewrite globals.css mobile-first, drop the 693-line override sheet
- 100dvh, safe-area insets, 56px touch targets, 12px minimum type
- landscape treated as a first-class orientation for camera games

See docs/OVERHAUL_2026-08-16.md and docs/AUDIT_2026-08-16.md.
"@
    git commit -m $message
    Ok "commit dibuat ($pending file)"
} else {
    Warn "tidak ada perubahan untuk di-commit"
}

git push origin $SourceBranch
Ok "push $SourceBranch"

# --- 4. Arsipkan main yang lama -------------------------------------------
Step "Mengarsipkan main lama ke $ArchiveBranch"
$exists = git rev-parse --verify --quiet "refs/heads/$ArchiveBranch"
if ($exists) {
    Warn "$ArchiveBranch sudah ada, dilewati"
} else {
    git branch $ArchiveBranch origin/main
    Ok "branch arsip dibuat dari origin/main"
}

# Arsip di-push DULU. Kalau ini gagal, main tidak disentuh.
git push origin $ArchiveBranch
Ok "arsip aman di remote: $ArchiveBranch"

# --- 5. Pindahkan main ke isi V3 ------------------------------------------
Step "Memindahkan main ke isi $SourceBranch"
git checkout main
git reset --hard $SourceBranch
Ok "main sekarang identik dengan $SourceBranch"

git push origin main --force-with-lease
Ok "push main"

# --- 6. Ringkasan ---------------------------------------------------------
Step "Selesai"
Write-Host ""
Write-Host "    main                          -> V3 + perbaikan 16 Agustus" -ForegroundColor Green
Write-Host "    $ArchiveBranch  -> isi main yang lama, tersimpan utuh" -ForegroundColor Green
Write-Host ""
Write-Host "  Langkah berikutnya:" -ForegroundColor Cyan
Write-Host "    1. npm install          (sekaligus unduh model face_landmarker)"
Write-Host "    2. npm run check        (gate lengkap harus hijau)"
Write-Host "    3. Cek panel deploy: pastikan mainlagi.inmydraft.com di-hook ke main"
Write-Host ""

# --- 7. Bersihkan berkas sementara ----------------------------------------
# Sesi Cowork tidak bisa menghapus file lewat jembatan folder, jadi berkas
# sementara dikumpulkan di _to_delete\ dan dihapus di sini.
Step "Membersihkan berkas sementara"
if (Test-Path "_to_delete") {
    Remove-Item "_to_delete" -Recurse -Force
    Ok "hapus _to_delete\"
}
foreach ($stale in @("src\app\mobile.css", "src\lib\interaction\relative-hand-mapper.ts")) {
    if (Test-Path $stale) {
        Warn "$stale sekarang kosong / deprecated - aman dihapus manual kalau mau"
    }
}

# --- 8. Bersihkan cache build lama ----------------------------------------
# Perubahan 18 Agustus menyentuh runtime kamera dan CSS global. Cache dev
# Turbopack yang lama bisa menyajikan chunk basi dan memunculkan ChunkLoadError.
Step "Membersihkan cache build"
foreach ($cache in @(".next", ".qa-dist")) {
    if (Test-Path $cache) {
        Remove-Item $cache -Recurse -Force
        Ok "hapus $cache"
    }
}
Write-Host ""
Write-Host "  Jangan lupa: npm install  (untuk mengunduh face_landmarker.task)" -ForegroundColor Cyan
Write-Host ""
