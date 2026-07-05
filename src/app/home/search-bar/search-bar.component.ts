import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, EMPTY } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { IonItem, IonLabel, IonList, IonSearchbar, IonToolbar } from '@ionic/angular/standalone';
import { StudentService, Student42 } from '../../student/student.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrls: [],
  imports: [IonItem, IonLabel, IonList, IonSearchbar, IonToolbar],
})
export class SearchBarComponent {

  private studentService = inject(StudentService);
  private router = inject(Router);

  public results: Student42[] = [];
  public isFocused = false;
  public noResults = false;

  private query$ = new Subject<string>();

  constructor() {
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => query.length > 0),
      switchMap(query => this.studentService.searchUsers(query)),
      takeUntilDestroyed(),
    ).subscribe({
      next: (users) => {
        this.results = users.sort((a, b) => a.login.localeCompare(b.login));
        this.noResults = this.results.length === 0;
      },
      error: (err) => { console.error('API error:', err); },
    });
  }

  handleInput(event: Event) {
    const query = (event.target as HTMLIonSearchbarElement).value?.trim().toLowerCase() ?? '';
    this.noResults = false;
    if (!query) {
      this.results = [];
    }
    this.query$.next(query);
  }

  selectStudent(student: Student42) {
    this.router.navigate(['/student', student.login]);
  }
}
