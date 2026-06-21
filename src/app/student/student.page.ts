import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { StudentService, Student42 } from './student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule],
})
export class StudentPage implements OnInit {

  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  student: Student42 | null = null;

  ngOnInit() {
    const login = this.route.snapshot.paramMap.get('login') ?? '';
    this.studentService.getUserByLogin(login).subscribe({
      next: (data) => { this.student = data; },
      error: (err) => { console.error('Erreur fetch student:', err); },
    });
  }
}
