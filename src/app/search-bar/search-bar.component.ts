import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonList, IonSearchbar, IonToolbar } from '@ionic/angular/standalone';
import { StudentService, Student42 } from '../student/student.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [IonItem, IonLabel, IonList, IonSearchbar, IonToolbar],
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
    let filteredQuery = query.toLowerCase();
    this.studentService.searchUsers(filteredQuery).subscribe({
      next: (users) => { this.results = users.sort((a, b) => a.login.localeCompare(b.login)); },
      error: (err) => { console.error('API error:', err); },
    });
  }

  selectStudent(student: Student42) {
    this.router.navigate(['/student', student.login]);
  }
}
