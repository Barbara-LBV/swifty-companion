# Swifty Companion

## Le Simulateur - the Simulator

## Elements css/html pour definir les components Ionic

1. ionic debounce -> pour la searchbar dynamique (Balkis)
2. formulaire de connexion: un bouton pour the connecter via l'API 42
3. Toggle pour cacher ou montrer certaines donnees sensibles comme le tel (ou ne montrer que les 2 premiers et 2 derniers chiffres)

## Infos qui doivent etre presentes :

- [ ] Photo
- [ ] Mail
- [ ] Nom - prenom
- [ ] point d'eval
- [ ] level
- [ ] login
- [ ] location
- [ ] mobile phone
- [ ] skills are displayed along with their levels and percentages.
- [ ] projects completed, including the ones that have failed.

## Les liens API pour display les infos

user's achievements :

```bash
GET /v2/achievements_users/:id
```

campus users :

```bash
GET /v2/campus_users
GET /v2/users/:user_id/campus_users
GET /v2/campus_users/:id 
```

user's cursus :

```bash
GET /v2/cursus_users/:id
```

dash of user :

```bash
GET /v2/dashes_users/:id
```

expertise of user :

```bash
GET /v2/users/:user_id/expertises_users
```

langages of user

```bash
GET /v2/users/:user_id/languages_users/:id 
```

projects: Users which did or are doing a project 
NB: this project only displays the validated projects, while this endpoint will send all the projects, including the current ones

```bash
GET /v2/projects/:project_id/projects_users/graph(/on/:field(/by/:interval))
GET /v2/users/:user_id/projects_users/graph(/on/:field(/by/:interval))
GET /v2/users/:user_id/projects_users
```

## les elements css ionic de la page stud

- **accordeon pour les projets retry** : ion-accordion
- **scroll pour les projets et competences, wraper ?** : ion-infinite-scroll
- **bouton de navigation vers "skills" et "projects"** : ion-router ou ...
- **pas de routage mais des segments ou une tabs**: ion-segment ou ion-tabs (icones en bas de l'ecran)
    -   pas de routage supplementaire a faire
    -   acces aux elements toujours visible
- **thumbnail pour la photo** : ion-thumbnail, wrappable dans un ion-item(parent) et positionnable
- **ion-item pour display infos principales de l'intra** : composant parent


### reste a faire 
- mettre les "projects retried"
- mettre les competences/skills
- revoir un peu le style (couleur, font etc)

1- Mettre un menu deroulant pour choisir le cursus. Par defaut, on met le '42cursus|42senior|42zip' s'ils existent, sinon, on met la piscineC ou next (prioritaire sur la discovery si elle existe), et la piscine discovery s'il n'y a que ca.
 -> de fait, n'afficher que les projets lies au cursus demande.

2- afficher les projets retries dans tous les cas

3- afficher les skills : passer par le 


<!-- async ngOnInit() {
    const login = this.route.snapshot.paramMap.get('login') ?? '';
    this.loading.set(true);
    try {
      const profile = await firstValueFrom(this.studentService.getFullProfile(login));
      this.profile.set(profile);

      const rawProjects = profile.student.projects_users.filter(p => p.status === 'finished');
      const groupedProjects = await firstValueFrom(this.studentService.groupedRetriedProjects(rawProjects));
      this.projects.set(groupedProjects);
      const studentId = profile.student.id;
      const [skills] = await Promise.all([
        firstValueFrom(this.studentService.getUserSkills(studentId)),
      ]);
      this.rawSkills.set(skills);
    } catch {
      this.error.set('Impossible de charger le profil.');
    } finally {
      this.loading.set(false);
    }
  } -->

   <!-- groupedRetriedProjects(projects: ProjectUser[]): Observable<GroupedProject[]> {
    return of(projects).pipe(
      map(projects => {
        const byProject = new Map<number, ProjectUser[]>();
        for (const p of projects.filter(p => p.status === 'finished')) {
          const arr = byProject.get(p.project.id) ?? [];
          arr.push(p);
          byProject.set(p.project.id, arr);
        }
        return Array.from(byProject.values()).map(attempts => ({
          project: attempts[0].project,
          attempts: attempts.sort((a, b) => a.occurrence - b.occurrence),
          isRetried: attempts.length > 1,
        }));
      })
    );
  } -->