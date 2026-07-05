// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  uid: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
  secret: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
  // No 42 client secret here anymore: the app asks this local proxy
  // (see /server) for a token, and the proxy is the only thing that
  // ever holds the real secret.
  // tokenProxyUrl: 'http://192.168.1.132:3000/api/token',
  //  tokenProxyUrl: 'http://localhost:3000/api/token',
   
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
