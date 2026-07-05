#!/usr/bin/env bash
# Build the web app and deploy it to a connected Android device/emulator.
# ionic build needs Node 20 here (Node 22 resolves a stale global `ionic` CLI
# and fails); the Capacitor CLI needs Node >=22.
set -e

source "$HOME/.nvm/nvm.sh"

nvm use 20
npx ionic build

nvm use 22
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
npx cap sync android
npx cap run android
