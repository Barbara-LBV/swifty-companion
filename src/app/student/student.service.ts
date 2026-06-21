import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// interfaces representing the structure of objects returned by the 42 API
export interface Student42 {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url: string;
  mobile: string;
  campus: string;
  eval_points: number;
  wallet: number;
  level: number;
}

export interface allStuds {
  id: number;
  studs: Student42[];
}

export interface Student42Dashboard {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url: string;
}

export interface Student42Projects {
  id: number;
  projects: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    note: number | null;
  }[];
}

export interface Student42XP {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url: string;
}


@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);

  searchUsers(login: string): Observable<Student42[]> {
    return this.http.get<Student42[]>(`https://api.intra.42.fr/v2/users`, {
      params: { 'search[login]': login, 'page[size]': '10' },
    });
  }

  getUserByLogin(login: string): Observable<Student42> {
    return this.http.get<Student42>(`https://api.intra.42.fr/v2/users/${login}`);
  }

  getUserInfo(id: number): Observable<Student42> {
    return this.http.get<Student42>(`https://api.intra.42.fr/v2/users/${id}`);
  }

  getUserDashboard(id: number): Observable<Student42Dashboard> {
    return this.http.get<Student42Dashboard>(`https://api.intra.42.fr/v2/dashes_users/${id}`);
  }

  getUserProjects(id: number): Observable<Student42Projects> {
    return this.http.get<Student42Projects>(`https://api.intra.42.fr/v2/users/projects_users/${id}`);
  }

  getUserXP(id: number): Observable<Student42XP> {
    return this.http.get<Student42XP>(`https://api.intra.42.fr/v2/users/${id}`);
  }
}