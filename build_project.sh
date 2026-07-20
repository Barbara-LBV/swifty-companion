#!/usr/bin/env bash
set -eu

npm install

# Generate web assets expected by Capacitor (webDir=www).
npm run build

echo "sdk.dir=/home/blefebvr/Android/Sdk" > android/local.properties
npx cap sync android

# A LANCER SUR UN AUTRE TERMNAL !!
# adb connect 10.80.243.115:PORT_ACTUEL
# adb devices

cd android
./gradlew assembleDebug

# Stop early if no Android device/emulator is connected.
if ! adb devices | awk 'NR > 1 && $2 == "device" { found=1 } END { exit(found ? 0 : 1) }'; then
	echo "No Android device/emulator detected via adb."
	echo "Connect a device (or start an emulator), then rerun the script."
	exit 1
fi

adb install -r app/build/outputs/apk/debug/app-debug.apk

cd ..
ionic serve --external --host=0.0.0.0 --port=8100