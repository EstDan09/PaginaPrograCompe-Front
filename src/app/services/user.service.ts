import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';

type SafeUser = {
  _id: string;
  username: string;
  email?: string;
  role?: string;
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private _http = inject(HttpClient);

  getByUsername(username: string) {
    const u = username.trim();
    if (!u) return of(null);

    return this._http
      .get<SafeUser>(`${environment.apiUrl}/user/get-by-username/${encodeURIComponent(u)}`)
      .pipe(
        catchError((err) => {
          return of(null);
        })
      );
  }
}
