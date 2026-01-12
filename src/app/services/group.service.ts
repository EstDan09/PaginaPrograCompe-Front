import { inject, Injectable, signal } from '@angular/core';
import { IGroup } from '../models/group.model';
import { IUser } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//All this data will go once the service can serve from API
export class GroupService {

  _URL = `${environment.apiUrl}/group/get`;
  _http: HttpClient = inject(HttpClient);

  private _groupList = signal<IGroup[] | null>(null);
  readonly groupList = this._groupList.asReadonly();



  getGroupById(id: string) {


  }

  getMyGroups() {
    return this._http.get<IGroup[]>(this._URL).pipe(
      tap(groups => this._groupList.set(groups)),
      catchError(() => {
        return of(null);
      })
    );


  }

}


