#!/usr/bin/env bash
set -Eeuo pipefail

GITLEAKS_VERSION="v8.30.1"

echo "Installing pinned Gitleaks ${GITLEAKS_VERSION}"
go install "github.com/zricethezav/gitleaks/v8@${GITLEAKS_VERSION}"

echo "Scanning full Git history with redacted output"
"$(go env GOPATH)/bin/gitleaks" git \
  --redact \
  --no-banner \
  --verbose \
  --log-opts="--all" \
  .
