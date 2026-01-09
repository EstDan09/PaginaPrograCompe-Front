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
  groups = computed(() => this._user()?.child_groups ?? []);

  constructor() {
    const storedToken = localStorage.getItem('token');

    if (storedToken){
      this._token.set(storedToken);
      this.fetchMe().subscribe();
    }
  }

  login(username: string, password: string) {
    return this._http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(({ token}) => this.setToken(token)),
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

  register(data: { username: string; password: string; role: 'student' | 'coach'; email?: string }) {
    return this._http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(({ token }) => this.setToken(token)),
      switchMap(() => this.fetchMe()),
      catchError((err) => {
        this.clearSession();
        return of(null);
      })
    );
  }

  fetchMe() { //profile
  return this._http.get<IUser>(`${environment.apiUrl}/user/me`).pipe(
    tap(user => this._user.set(user)),
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          this.clearSession();
        }
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
    this._token.set(token);
    localStorage.setItem('token', token);
  }

}
