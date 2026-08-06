const PLAY_ATTEMPT_TIMEOUT_MS = 1800;
const FIRST_FRAME_TIMEOUT_MS = 6500;
const POLL_INTERVAL_MS = 80;

interface PlaybackAttempt {
  ok: boolean;
  error?: unknown;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function playbackErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Browser menolak pemutaran preview kamera. Tutup panel izin Chrome, lalu klik Aktifkan kamera lagi.";
    }
    if (error.name === "NotReadableError") {
      return "Kamera sedang dipakai aplikasi lain atau tidak dapat dibaca oleh browser.";
    }
  }
  return error instanceof Error
    ? error.message
    : "Preview kamera gagal diputar oleh browser.";
}

async function waitForFirstFrame(
  video: HTMLVideoElement,
  timeoutMs: number
): Promise<boolean> {
  const deadline = performance.now() + timeoutMs;
  let previousTime = video.currentTime;

  while (performance.now() < deadline) {
    const hasDimensions = video.videoWidth > 0 && video.videoHeight > 0;
    const hasCurrentData =
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
    const timeAdvanced = video.currentTime > previousTime;

    if (hasDimensions && hasCurrentData && (!video.paused || timeAdvanced)) {
      return true;
    }

    previousTime = video.currentTime;
    await delay(POLL_INTERVAL_MS);
  }

  return false;
}

/**
 * Attaches a camera stream without allowing a pending HTMLVideoElement.play()
 * promise to block the entire vision startup forever. Chrome can report the
 * camera as active while play() is still pending, especially after permission
 * UI or device hand-off. We therefore cap the play attempt and verify that an
 * actual video frame becomes available.
 */
export async function attachCameraStream(
  video: HTMLVideoElement,
  stream: MediaStream
): Promise<void> {
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.srcObject = stream;

  const playbackAttempt: Promise<PlaybackAttempt> = video
    .play()
    .then(() => ({ ok: true }))
    .catch((error: unknown) => ({ ok: false, error }));

  const firstResult = await Promise.race([
    playbackAttempt,
    delay(PLAY_ATTEMPT_TIMEOUT_MS).then(() => null)
  ]);

  if (firstResult && !firstResult.ok) {
    throw new Error(playbackErrorMessage(firstResult.error));
  }

  const frameReady = await waitForFirstFrame(video, FIRST_FRAME_TIMEOUT_MS);
  if (!frameReady) {
    const track = stream.getVideoTracks()[0];
    const trackState = track?.readyState ?? "unknown";
    throw new Error(
      `Kamera sudah aktif tetapi browser tidak mengirim frame video (track: ${trackState}). Tutup aplikasi lain yang memakai kamera, tutup panel izin Chrome, lalu aktifkan ulang kamera.`
    );
  }
}
