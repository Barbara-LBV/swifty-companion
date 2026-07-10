import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

  // to test the refreshToken() method, force the token to expire
  // forceExpire(): void {
  // this.expiresAt = 0;
  // }

  getValidToken(): Observable<string> {
    this.expiresAt = 0;
    if (this.token && Date.now() < this.expiresAt) {
      return of(this.token); // if token still valid
    }
    return this.refreshToken();
  }

  refreshToken(): Observable<string> {
    this.token = null;
    return this.fetchToken();
  }

  private fetchToken(): Observable<string> {
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

// HTTP interceptor that automatically adds a valid 42 access token to every request.
export const api42Interceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/oauth/'))
    return next(req);

  const auth = inject(Auth);
  return auth.getValidToken().pipe(
    switchMap(token =>
         next(req.clone({ setHeaders: { Authorization: `Bearer '${token}'` } })) // replace token by anything to test refreshToken() on 401
    ),
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return auth.refreshToken().pipe(
          switchMap(token => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
        );
      }
      return throwError(() => err);
    }),
  );
};