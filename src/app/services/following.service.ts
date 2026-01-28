import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';
import { IFollowingResponse, IFollowName } from '../models/following-list.model';

@Injectable({ providedIn: 'root' })
export class FollowingService {
  private _URL = `${environment.apiUrl}/following`;
  private _http = inject(HttpClient);

  private _followingList = signal<IFollowName[]>([]);
  readonly followingList = this._followingList.asReadonly();

  getFollowing() {
    return this._http.get<IFollowingResponse>(this._URL).pipe(
      tap((res) => this._followingList.set(res.following ?? [])),
      catchError((err) => {
        console.log('Failed to load following', err);
        this._followingList.set([]);
        return of(null);
      })
    );
  }
}
