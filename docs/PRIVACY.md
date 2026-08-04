# Privacy Design

- No login or user profile.
- No server database.
- No camera upload endpoint.
- No face recognition.
- No microphone access.
- Video frames are processed only by MediaPipe in the browser.
- Only local scores/settings may be saved in localStorage.
- Camera tracks are stopped and the landmarker is closed during cleanup.
