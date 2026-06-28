import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonImg,
  IonCard, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { StudentService, FullProfile, SkillUser, GroupedProject } from './student.service';
import { SegmentComponent } from '../segment/segment.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonImg,
    IonCard, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonAvatar, IonLabel,
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
      const [skills, projects] = await Promise.all([
        firstValueFrom(this.studentService.getUserSkills(studentId)),
        firstValueFrom(this.studentService.groupedRetriedProjects(studentId)),
      ]);
      this.rawSkills.set(skills);
      this.projects.set(projects);
    } catch {
      this.error.set('Impossible de charger le profil.');
    } finally {
      this.loading.set(false);
    }
  }
}
