import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, switchMap } from 'rxjs';


// interfaces representing the structure of objects returned by the 42 API
export interface SkillUser {
  id: number;
  name: string;
  level: number;
  pourcent: number;
}

export interface CursusUser {
  id: number;
  begin_at: string;
  end_at: string | null;
  grade: string | null;
  level: number;
  cursus_id: number;
  cursus: { id: number; name: string; slug: string };
  projects_users: ProjectUser[];

}

export interface Team {
  id: number;
  name: string;
  final_mark: number | null;
  status: string;
  created_at: string;
  closed_at: string | null;
}

export interface ProjectUser {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status: string;
  'validated?': boolean;
  created_at: string;
  current_team_id: number | null;
  cursus_ids: number[];
  marked: boolean;
  marked_at: string | null;
  project: { id: number; name: string; slug: string; parent_id: number | null };
  teams: Team[];
}

export interface Student42 {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  image: { link: string; versions: { large: string; medium: string; small: string; micro: string } };
  phone: string;
  location: string | null;
  kind: string;
  correction_point: number;
  wallet: number;
  pool_month: string;
  pool_year: string;
  campus: { id: number; name: string; time_zone: string }[];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
}

export interface GroupedProject {
  project: { id: number; name: string; slug: string; parent_id: number | null };
  attempts: Team[];
  finalMark: number | null;
  isRetried: boolean;
}

export interface FullProfile {
  student: Student42;
  skills: SkillUser[];
}

export interface allStuds {
  id: number;
  studs: Student42[];
}

const API = 'https://api.intra.42.fr/v2';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);

  searchUsers(login: string): Observable<Student42[]> {
    return this.http.get<Student42[]>(`${API}/users`, {
      params: { 'search[login]': login, 'page[size]': '10' },
    });
  }

  getUserByLogin(login: string): Observable<Student42> {
    return this.http.get<Student42>(`${API}/users/${login}`);
  }

  getUserInfo(id: number): Observable<Student42> {
    return this.http.get<Student42>(`${API}/users/${id}`);
  }

  getUserProjects(id: number): Observable<ProjectUser[]> {
    return this.http.get<ProjectUser[]>(`${API}/users/${id}/projects_users`);
  }

  getUserSkills(id: number): Observable<SkillUser[]> {
    return this.http.get<SkillUser[]>(`${API}/skills`);
  }

  getFullProfile(login: string): Observable<FullProfile> {
    return this.http.get<Student42>(`${API}/users/${login}`).pipe(
      switchMap(user => {
        const cursus42 = user.cursus_users.find(c => c.cursus.name === '42cursus');
        return forkJoin({
          student: of(user),
          skills:  of([]),
        });
      })
    );
  }

  displayProjectByCursus(projects: ProjectUser[], cursusId: number): ProjectUser[] {
    return projects.filter(p => p.cursus_ids.includes(cursusId));
  }

  groupedRetriedProjects(projects: ProjectUser[]): GroupedProject[] {
    const byProject = new Map<number, ProjectUser[]>();
    for (const p of projects.filter(p => p.status === 'finished')) {
      const arr = byProject.get(p.project.id) ?? [];
      arr.push(p);
      byProject.set(p.project.id, arr);
    }
    return Array.from(byProject.values()).map(projectUsers => {
      const attempts = ([] as Team[])
        .concat(...projectUsers.map(pu => pu.teams))
        .sort((a: Team, b: Team) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const latest = projectUsers.reduce((a, b) =>
        new Date(b.created_at).getTime() > new Date(a.created_at).getTime() ? b : a
      );
      return {
        project: latest.project,
        attempts,
        finalMark: latest.final_mark,
        isRetried: attempts.length > 1,
      };
    });
  }


  calculateSkillLevel(skills: SkillUser[], project: ProjectUser): number {
    const totalLevel = skills.reduce((sum, skill) => sum + skill.level, 0);
    return skills.length > 0 ? Math.round(totalLevel / skills.length) : 0;
  }
}
