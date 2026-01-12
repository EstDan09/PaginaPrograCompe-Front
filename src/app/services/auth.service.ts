import { Injectable, signal, computed, inject } from "@angular/core";
import { IUser } from "../models/user.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { tap, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

type AuthResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _http = inject(HttpClient);

  private _token = signal<string | null>(null);
  private _user = signal<IUser | null>(null);

  token = this._token.asReadonly();
  user = this._user.asReadonly();

  isLoggedIn = computed(() => this._user() !== null);

  userId = computed(() => this._user()?._id ?? 'none');
  username = computed(() => this._user()?.username ?? 'Guest');
  email = computed(() => this._user()?.email ?? '—');
  role = computed(() => this._user()?.role ?? '—');

  constructor() {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      this._token.set(storedToken);
      this.fetchMe().subscribe();
    }
  }

  login(username: string, password: string) {
    return this._http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(({ token }) => this.setToken(token)),
      switchMap(() => this.fetchMe()),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  register(data: { username: string; password: string; role: 'student' | 'coach'; email?: string }) {
    return this._http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(({ token }) => this.setToken(token)),
      switchMap(() => this.fetchMe()),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  logout() {
    this.clearSession();
  }

  fetchMe() {
    return this._http.get<IUser>(`${environment.apiUrl}/user/me`).pipe(
      tap(user => this._user.set(user)),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.clearSession();
        }
        return of(null);
      })
    );
  }

  private clearSession() {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem('token');
  }

  private setToken(token: string) {
    const clean = token.trim();
    this._token.set(clean);
    localStorage.setItem('token', clean);
  }
}
