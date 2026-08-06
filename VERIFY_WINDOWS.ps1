$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Mainlagi TV Motion Learning Hub V2.0.2 - Laptop Verification" -ForegroundColor Cyan

Write-Host "[1/6] Node dan npm" -ForegroundColor Cyan
node --version
if ($LASTEXITCODE -ne 0) { throw "Node.js tidak tersedia." }
npm.cmd --version
if ($LASTEXITCODE -ne 0) { throw "npm tidak tersedia." }

Write-Host "[2/6] Install dependency" -ForegroundColor Cyan
npm.cmd install
if ($LASTEXITCODE -ne 0) { throw "npm install gagal." }

$localTsc = Join-Path $PSScriptRoot "node_modules\.bin\tsc.cmd"
if (-not (Test-Path $localTsc)) {
  throw "TypeScript compiler lokal tidak ditemukan setelah npm install. Hapus node_modules lalu jalankan script ini lagi."
}

Write-Host "[3/6] Portable package gate" -ForegroundColor Cyan
npm.cmd run check:portable
if ($LASTEXITCODE -ne 0) { throw "Portable gate gagal." }

Write-Host "[4/6] Full Next.js quality gate" -ForegroundColor Cyan
npm.cmd run check
if ($LASTEXITCODE -ne 0) { throw "npm run check gagal. Jangan push atau merge." }

Write-Host "[5/6] Production dependency audit" -ForegroundColor Cyan
npm.cmd audit --omit=dev --audit-level=high
if ($LASTEXITCODE -ne 0) {
  throw "Production audit menemukan high/critical advisory. Jangan gunakan --force; review dependency dahulu."
}

Write-Host "[6/6] Git status (opsional)" -ForegroundColor Cyan
if (Test-Path ".git") {
  git status
} else {
  Write-Host "Folder download belum menjadi Git repository." -ForegroundColor DarkGray
}

Write-Host "Automated laptop verification lulus." -ForegroundColor Green
Write-Host "Lanjutkan physical camera QA di docs/CAMERA_QA.md sebelum push/merge." -ForegroundColor Yellow
