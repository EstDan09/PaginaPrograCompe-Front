import { inject, Injectable, signal } from '@angular/core';
import { IGroup, IGroupData } from '../models/group.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//All this data will go once the service can serve from API
export class GroupService {

  _URL = `${environment.apiUrl}/student-group/get`;
  _ALTER = `${environment.apiUrl}/group/get`;
  _http: HttpClient = inject(HttpClient);

  private _groupList = signal<IGroup[] | null>(null);
  readonly groupList = this._groupList.asReadonly();

  private _group = signal<IGroupData | null>(null);
  readonly group = this._group.asReadonly();



  getGroupById(id: string) {
    return this._http.get<IGroupData>(this._ALTER + '/' + id).pipe(
      tap(response => this._group.set(response)),
      catchError(() => {
        return of(null);
      })
    );

  }

  getMyGroups() {
    return this._http.get<IGroup[]>(this._URL).pipe(
      tap((groups) => {
        this._groupList.set(groups);
        console.log(groups);
      }),
      catchError(() => {
        return of(null);
      })
    );


  }

}


