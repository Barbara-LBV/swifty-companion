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
- [ ] location
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

## launching project

1. in one terminal, launch the server :

```bash
cd server
npm start
```

2. in a 2nd terminal, launch ionic server at the project root - ./Swifty-Companion

```bash
ionic serve
```

## Test for refresh token

**jjjj**