/// <reference types="@capacitor-community/safe-area" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Swifty-Companion',
  webDir: 'www',
  // server: {
  //   url: 'http://10.80.243.115:8100',
  //   cleartext: true
  // },
  plugins: {
    CapacitorHttp: { enabled: true },
    SystemBars: { insetsHandling: 'disable' },
  },
};

export default config;
