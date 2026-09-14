import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".qa-dist/**",
    ".learning-test-dist/**",
    ".learning-isolation-dist/**",
    ".batch17-final-dist/**",
    ".audio-test-dist/**",
    "coverage/**",
    "qa/**",
    "preview/**",
    "internal/**",
    "_to_delete/**",
    "public/mediapipe/**",
    "public/models/**"
  ])
]);
