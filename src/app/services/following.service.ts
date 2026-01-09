import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FollowingService {
  private _URL = `${environment.apiUrl}/following`
  private _http = inject(HttpClient)




  getFollowing() {
    return this._http.get(this._URL);
  }

}
