import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonSearchbar } from '@ionic/angular/standalone';
import { StudentService, Student42 } from '../student/student.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [IonItem, IonLabel, IonList, IonSearchbar],
})
export class SearchBarComponent {

  private studentService = inject(StudentService);
  private router = inject(Router);

  public results: Student42[] = [];
  public isFocused = false;

  handleInput(event: Event) {
    const query = (event.target as HTMLIonSearchbarElement).value?.trim() ?? '';
    if (!query) {
      this.results = [];
      return;
    }
    this.studentService.searchUsers(query).subscribe({
      next: (users) => { this.results = users; },
      error: (err) => { console.error('API error:', err); },
    });
  }

  selectStudent(student: Student42) {
    this.router.navigate(['/student', student.login]);
  }
}
