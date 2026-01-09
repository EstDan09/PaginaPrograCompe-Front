import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IFollowingList, IFollow } from '../models/following-list.model';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FollowingService {
  private _URL = `${environment.apiUrl}/following/get`
  private _http = inject(HttpClient)

  private _followingList = signal<IFollow[] | null>(null);


  getFollowing() {
    return this._http.get<IFollow[]>(this._URL).pipe(
      tap(following => this._followingList.set(following)),
      catchError(() => {
        return of(null)
      })
    );
  }



}
