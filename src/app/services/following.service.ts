import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IFollowingList } from '../models/following-list.model';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FollowingService {
  private _URL = `${environment.apiUrl}/following`
  private _http = inject(HttpClient)

  private _followingList = signal<IFollowingList | null>(null);


  getFollowing() {
    return this._http.get<IFollowingList>(this._URL).pipe(
      tap(following => this._followingList.set(following)),
      catchError(() => {
        return of(null)
      })
    );
  }

  getFollowingNames(following: IFollowingList | null) {
    if (!following) {
      console.log("There is no friend list");
      return;
    }


  }

}
