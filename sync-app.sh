#!/usr/bin/env bash
# Sync APK + version metadata from the native app project into this website.
# Usage: ./sync-app.sh [path-to-favtoon_mobile]
set -euo pipefail
cd "$(dirname "$0")"

SRC="${1:-../favtoon_mobile}"
APK="$SRC/app/build/outputs/apk/release/app-release.apk"
[ -f "$APK" ] || APK="$SRC/app/build/outputs/apk/debug/app-debug.apk"
SRC_VERSION="$SRC/version.json"

if [ ! -f "$APK" ]; then
  echo "APK not found (run ./gradlew :app:assembleRelease first)" >&2
  exit 1
fi

node - "$APK" "$SRC_VERSION" <<'NODE'
const fs = require('fs');
const path = require('path');
const [apk, srcVersion] = process.argv.slice(2);

const version = JSON.parse(fs.readFileSync(srcVersion, 'utf8'));
const destApk = `assets/favtoon-v${version.versionName}.apk`;

fs.copyFileSync(apk, destApk);
version.downloadUrl = destApk;
fs.writeFileSync('version.json', JSON.stringify(version, null, 2) + '\n');

console.log(`Synced v${version.versionName} (code ${version.versionCode}) -> ${destApk}`);
NODE
