import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonImg,
  IonCard, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel } from '@ionic/angular/standalone';
import { StudentService, FullProfile, SkillUser, GroupedProject } from './student.service';
import { SegmentComponent } from '../segment/segment.component';
import { CursusComponent } from '../cursus/cursus.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonImg,
    IonCard, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, CursusComponent,
    SegmentComponent],
})
export class StudentPage implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  profile = signal<FullProfile | null>(null);
  rawSkills = signal<SkillUser[]>([]);
  projects = signal<GroupedProject[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // TODO: croiser rawSkills avec projects pour calculer les skills affichés
  skills = computed(() => this.rawSkills());

  async ngOnInit() {
    const login = this.route.snapshot.paramMap.get('login') ?? '';
    this.loading.set(true);
    try {
      const profile = await firstValueFrom(this.studentService.getFullProfile(login));
      this.profile.set(profile);

      const studentId = profile.student.id;
      const [projectsUsers, skills] = await Promise.all([
        firstValueFrom(this.studentService.getUserProjects(studentId)),
        firstValueFrom(this.studentService.getUserSkills(studentId)),
      ]);
      // const cursus42 = profile.student.cursus_users.find(c => c.cursus.name === '42cursus');
      // if (cursus42) {
      //   const cursusId = cursus42.cursus.id;
      //   const filteredProjects = this.studentService.displayProjectByCursus(grouped, cursusId);
      //   this.projects.set(filteredProjects);
      // }
      const grouped = this.studentService.groupedRetriedProjects(projectsUsers)
        .filter(p => p.attempts.length > 0);
      this.projects.set(grouped);
      this.rawSkills.set(skills);
    } catch {
      this.error.set('Impossible de charger le profil.');
    } finally {
      this.loading.set(false);
    }
  }
}
