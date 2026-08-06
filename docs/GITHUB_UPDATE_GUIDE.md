# GitHub Update Guide

Target repository: `ceritaantarkita-req/motion-learning-hub`

Package ini adalah replacement candidate pada branch rebuild, bukan patch yang dijalankan di working tree lama.

## 1. Extract dan verifikasi ZIP terlebih dahulu

```powershell
cd "C:\Users\Amand\Downloads\motion-learning-hub-mainlagitv-v2-corrected"
powershell -ExecutionPolicy Bypass -File .\VERIFY_WINDOWS.ps1
```

Setelah automated gate lulus:

```powershell
npm.cmd run dev
```

Uji sembilan route, demo mode, camera mode, dan `docs/CAMERA_QA.md`. Hentikan server dengan `Ctrl+C`.

## 2. Pastikan repository lama bersih

```powershell
cd "C:\Users\Amand\.gemini\antigravity\scratch\ideagentics\demo\AR\motion-learning-hub"
git status
git switch main
git pull --ff-only
```

`git status` harus menunjukkan working tree clean.

## 3. Tag V1

```powershell
git tag legacy-motion-learning-hub-v1-20260805
git push origin legacy-motion-learning-hub-v1-20260805
```

Bila tag tersebut sudah ada, jangan membuat tag duplikat.

## 4. Buat fresh clone

```powershell
cd "C:\Users\Amand\.gemini\antigravity\scratch\ideagentics\demo\AR"
git clone https://github.com/ceritaantarkita-req/motion-learning-hub.git motion-learning-hub-mainlagitv-v2-repo
cd motion-learning-hub-mainlagitv-v2-repo
git switch -c rebuild/mainlagitv-v2
```

## 5. Hapus source lama tetapi pertahankan `.git`

Pastikan terminal berada di folder fresh clone.

```powershell
Get-ChildItem -Force |
  Where-Object { $_.Name -ne ".git" } |
  Remove-Item -Recurse -Force
```

## 6. Salin package V2

```powershell
robocopy `
  "C:\Users\Amand\Downloads\motion-learning-hub-mainlagitv-v2-corrected" `
  "." `
  /E `
  /XD ".git" ".next" "node_modules" ".qa-dist" `
  /XF "*.zip" ".env.local"
```

Robocopy exit code 0–7 biasanya berarti copy berhasil. Code 8 atau lebih tinggi adalah failure.

## 7. Jalankan gate lagi dari dalam Git clone

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFY_WINDOWS.ps1
npm.cmd run dev
```

Uji ulang karena source sekarang berada pada path final repository.

## 8. Review perubahan

```powershell
git status
git diff --stat
git diff -- .env.example README.md package.json
```

Pastikan `.env.local`, secret, `node_modules`, `.next`, dan file ZIP tidak masuk staging.

## 9. Commit dan push

```powershell
git add -A
git status
git commit -m "feat: rebuild Motion Learning Hub as Mainlagi TV V2"
git push -u origin rebuild/mainlagitv-v2
```

## 10. Pull request

Buat PR:

```text
rebuild/mainlagitv-v2 -> main
```

Jangan merge sebelum:

- laptop `VERIFY_WINDOWS.ps1` lulus;
- production dependency audit lulus;
- physical camera checklist lulus;
- Supabase OAuth/RLS diuji bila fitur cloud diaktifkan;
- CI GitHub lulus.
