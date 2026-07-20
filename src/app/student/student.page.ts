import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { IonContent, IonSpinner, IonImg, IonCard, IonCardTitle, IonCardSubtitle 
  } from '@ionic/angular/standalone';
import { StudentService, ProjectUser, Student42 } from './student.service';
import { SegmentComponent } from './segment/segment.component';
import { CursusComponent } from './cursus/cursus.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'], 
  standalone: true,
  imports: [IonContent, IonSpinner, IonImg, IonCard, IonCardTitle, 
    IonCardSubtitle, CursusComponent, SegmentComponent, DecimalPipe],
})
export class StudentPage implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  profile = signal<Student42 | null>(null);
  rawProjectsUsers = signal<ProjectUser[]>([]);
  selectedCursusId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  skills = computed(() => {
    const cursusId = this.selectedCursusId();
    const cursusUsers = this.profile()?.cursus_users ?? [];
    const skills = cursusUsers.find(cu => cu.cursus.id === cursusId)?.skills ?? [];
    this.studentService.calculateSkillPourcent(skills);
    return skills;
  });

  projects = computed(() => {
    const cursusId = this.selectedCursusId();
    const raw = this.rawProjectsUsers();
    const filtered = cursusId !== null
      ? this.studentService.displayProjectByCursus(raw, cursusId)
      : raw;
    return this.studentService.groupedRetriedProjects(filtered)
      .filter(p => p.attempts.length > 0);
  });

  level = computed(() => {
    const cursusId = this.selectedCursusId();
    if (cursusId === null) return 0;
    const cursusUsers = this.profile()?.cursus_users ?? [];
    return this.studentService.displayLevelByCursus(cursusUsers, cursusId);
  });

  async ngOnInit() {
    const login = this.route.snapshot.paramMap.get('login') ?? '';
    this.loading.set(true);
    try {
      const profile = await firstValueFrom(this.studentService.getFullProfile(login));
      this.profile.set(profile);
      
      const studentId = profile.id;
      const projectsUsers = await firstValueFrom(this.studentService.getUserProjects(studentId));
      this.rawProjectsUsers.set(projectsUsers);
    } catch {
      this.error.set('Impossible de charger le profil.');
    } finally {
      this.loading.set(false);
    }
  }

  onCursusChange(cursusId: number) {
    this.selectedCursusId.set(cursusId);
  }
}
