import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';


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
  skills: SkillUser[];
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
  kind: string;
  level: number;
  correction_point: number;
  wallet: number;
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

const API = 'https://api.intra.42.fr/v2';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);

  searchUsers(login: string): Observable<Student42[]> {
    return this.http.get<Student42[]>(`${API}/users`, {
      params: { 'search[login]': login, 'page[size]': '10' },
    });
  }

  getUserProjects(id: number): Observable<ProjectUser[]> {
    return this.getAllPages<ProjectUser>(`${API}/users/${id}/projects_users`);
  }

  private getAllPages<T>(url: string, pageNumber = 1, pageSize = 100): Observable<T[]> {
    return this.http.get<T[]>(url, {
      params: { 'page[size]': pageSize, 'page[number]': pageNumber },
    }).pipe(
      switchMap(page => page.length < pageSize
        ? of(page)
        : this.getAllPages<T>(url, pageNumber + 1, pageSize).pipe(map(rest => page.concat(rest)))
      )
    );
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

  displayLevelByCursus(cursusUsers: CursusUser[], cursusId: number): number {
    const cursus = cursusUsers.find(c => c.cursus_id === cursusId);
    return cursus ? cursus.level : 0;
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


  calculateSkillPourcent(skills: SkillUser[]): void {
    for (const skill of skills) {
      skill.level = Math.round(skill.level * 100) / 100;
      const level = Math.floor(skill.level);
      skill.pourcent = Math.round((skill.level - level) * 100);
    }
  }
}
