# Swifty Companion

## The Simulator

A voir

## Elements css/html pour definir les components Ionic

1. ionic debounce -> for a dynamic searchbar
2. buttons to choose the cursus (if applyable)
    les Projets sont ensuite display selon le cursus -> plus propre que tout afficher d'un coup
3. accordion retried projects : ion-accordion
4. **use of segments**: ion-segment or ion-tabs (icons at the screen bottom)
    - no other routing to implement
    - elements still visible
5. **thumbnail for the profile img** : ion-thumbnail, wrappable in ion-item(parent) and positionnable
6. **ion-item to display usefull user infos from 42 intra** : parent component

## Infos which must be shown

- [v] Photo
- [v] Mail
- [v] first name - last name
- [v] eval points
- [v] level
- [v] login
- [v] location
- [v] mobile phone - hidden
- [v] skills are displayed along with their levels and percentages.
- [v] projects completed, including the ones that have failed.

## 42 API

user's infos :

```bash
GET /v2/users/:user_id
```

projects: Users which did or are doing a project.
NB: this endpoint is usefull to get the project and its attempts.

```bash
GET /v2/users/:user_id/projects_users
```

## launching project on computer

```bash
ionic serve
```

## launching project on the phone with usb (home)

`ionic build` needs Node 20, `cap sync`/`cap run` need Node >=22, and `ANDROID_HOME`/`ANDROID_SDK_ROOT` must point to the SDK. Either run:

```bash
npm run android:deploy
```

or manually:

```bash
nvm use 20
npx ionic build

nvm use 22
export ANDROID_HOME=~/Android/Sdk
export ANDROID_SDK_ROOT=~/Android/Sdk
npx cap sync android
npx cap run android
```

If you do not know the SDK path, check the current environment first:

```bash
printenv | grep -E '^ANDROID_HOME|^ANDROID_SDK_ROOT'
```

On this machine, those variables currently point to `/home/blefebvr/Android/Sdk`, but that folder does not exist. The only Android SDK content found is `/usr/lib/android-sdk/platform-tools`, which is not enough to build or deploy the app. A full Android SDK installation with `platforms/` and `build-tools/` is required.

## launching project on the phone with wifi (42)

Check if the phone is listed in connected devices

```bash
adb devices
```

if not

```bash
adb connect 10.80.243.115:PORT_CONNEXION //visible dans les opt de dev du tel
```

## Test for refresh token

1. Refresh "paresseux" par expiration locale (fonctionne déjà) — auth.ts:23-28 : getValidToken() ne rappelle /oauth/token que quand Date.now() >= expiresAt. Avec un expires_in de ~47 min renvoyé par l'API 42, il faudrait attendre 47 min pour l'observer naturellement. Fonction ```foceExpire()``` pour faire un refresh plus actif.

Pour tester ce qui existe déjà (cas 1), le plus simple sans attendre 47 min : modifier temporairement la ligne 47 en this.expiresAt = Date.now() + 5000; (5s), lancer l'app, ouvrir l'onglet Réseau, faire une recherche, attendre 5s, refaire une recherche → vous devriez voir un 2e appel POST /oauth/token avant le nouvel appel à /v2/users.

2. Refresh sur 401 ("token rejeté alors qu'on le croyait valide") — l'intercepteur (auth.ts:55-73) a un catchError qui, sur un 401, appeler refreshToken() puis rejouer la requête une fois avec le nouveau token.

Pour tester ce cas 2 : modifier temporairement le premier next(...) de l'intercepteur pour envoyer un token corrompu (Authorization: 'Bearer invalid_' + token), en laissant le retry intact. Relancer une recherche : on voit dans l'onglet Réseau un premier /v2/users en 401, puis un nouveau POST /oauth/token, puis le retry de /v2/users en 200 avec les résultats affichés normalement.
