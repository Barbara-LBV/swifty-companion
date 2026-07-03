import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getValidToken(): Observable<string> {
    if (this.token && Date.now() < this.expiresAt) {
      return of(this.token); // if token still valid
    }
    return this.fetchToken();
  }

  // Bypasses the local cache entirely: used when the API rejects a token
  // we believed was still valid (clock drift, early revocation, etc).
  refreshToken(): Observable<string> {
    this.token = null;
    return this.fetchToken();
  }

  private fetchToken(): Observable<string> {
    // The 42 client secret never lives in the app: this proxy (see /server)
    // holds it server-side and hands back a short-lived access token.
    return this.http.get<TokenResponse>(environment.tokenProxyUrl).pipe(
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
  if (req.url === environment.tokenProxyUrl) return next(req);

  const auth = inject(Auth);
  return auth.getValidToken().pipe(
    switchMap(token =>
      next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
        catchError(err => {
          // Our cached token looked valid but the API rejected it anyway:
          // force a fresh one and retry the request exactly once.
          if (err instanceof HttpErrorResponse && err.status === 401) {
            return auth.refreshToken().pipe(
              switchMap(freshToken =>
                next(req.clone({ setHeaders: { Authorization: `Bearer ${freshToken}` } }))
              ),
            );
          }
          return throwError(() => err);
        }),
      )
    ),
  );
};