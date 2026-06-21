import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpInterceptorFn } from '@angular/common/http';
import { switchMap } from 'rxjs';

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private http = inject(HttpClient);
  private token: string | null = null;
  private expiresAt = 0;
  
  getValidToken(): Observable<string> {
    if (this.token && Date.now() < this.expiresAt) {
      return of(this.token); // token encore valide, on le réutilise
    }
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', environment.uid)
      .set('client_secret', environment.secret);

    return this.http.post<TokenResponse>('https://api.intra.42.fr/oauth/token', body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      tap(res => {
        this.token = res.access_token;
        this.expiresAt = Date.now() + res.expires_in * 1000;
      }),
      map(res => res.access_token),
    );
  }
}

// Intercepteur HTTP pour ajouter le token d'authentification aux requêtes sortantes
export const api42Interceptor: HttpInterceptorFn = (req, next) => {
  // on ne touche pas à la requête du token elle-même
  if (req.url.includes('/oauth/')) return next(req);

  const auth = inject(Auth);
  return auth.getValidToken().pipe(
    switchMap(token =>
      next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
    ),
  );
};