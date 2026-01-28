import { inject, Injectable, signal, computed } from '@angular/core';
import { IGroup, IGroupData, IGroupDetails, 
  IMyGroupSummary, ICreatedGroup, IAddition, IGroupErr, IStudentGroupUsername } from '../models/group.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class GroupService {

  _URL = `${environment.apiUrl}/student-group/get`;
  _ALTER = `${environment.apiUrl}/group/get`;
  _CREATE = `${environment.apiUrl}/group/create`;
  _ADD = `${environment.apiUrl}/student-group/add-member`;
  _http: HttpClient = inject(HttpClient);

  private _groupList = signal<IGroup[] | null>(null);
  readonly groupList = this._groupList.asReadonly();

  private _group = signal<IGroupData | null>(null);
  readonly group = this._group.asReadonly();

  private _summaryURL = `${environment.apiUrl}/group/my-groups-summary`;

  private _membersWithUsernameURL = `${environment.apiUrl}/student-group/get-with-username`;

  private _groupMembers = signal<IStudentGroupUsername[] | null>(null);
  readonly groupMembers = this._groupMembers.asReadonly();

  readonly groupMemberUsernames = computed(() =>
    (this._groupMembers() ?? []).map(m => m.student_username)
  );


  private _myGroupsSummary = signal<IMyGroupSummary[] | null>(null);
  readonly myGroupsSummary = this._myGroupsSummary.asReadonly();

  private _groupDetailsURL = `${environment.apiUrl}/group/details`;
  private _groupDetails = signal<IGroupDetails | null>(null);
  readonly groupDetails = this._groupDetails.asReadonly();

  getGroupMembers(groupId: string) {
    return this._http
      .get<IStudentGroupUsername[]>(`${this._membersWithUsernameURL}?group_id=${groupId}`)
      .pipe(
        tap((rows) => this._groupMembers.set(rows)),
        catchError((err) => {
          console.log('Failed to load group members, using demo', err);

          const demo: IStudentGroupUsername[] = [
            { _id: '1', student_id: 's1', student_username: 'fisher199', group_id: groupId },
            { _id: '2', student_id: 's2', student_username: 'eddituss', group_id: groupId },
            { _id: '3', student_id: 's3', student_username: 'zenidog', group_id: groupId },
            { _id: '4', student_id: 's4', student_username: 'tourist', group_id: groupId },
          ];

          this._groupMembers.set(demo);
          return of(demo);
        })
      );
  }

  getMyGroupsSummary() {
    return this._http.get<IMyGroupSummary[]>(this._summaryURL).pipe(
      tap((rows) => this._myGroupsSummary.set(rows)),
      catchError((err) => {
        console.log('Failed to load my groups summary', err);
        this._myGroupsSummary.set([]);
        return of(null);
      })
    );
  }

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

  getGroupDetails(id: string) {
    return this._http.get<IGroupDetails>(`${this._groupDetailsURL}/${id}`).pipe(
      tap((payload) => {
        this._groupDetails.set(payload);
      }),
      catchError((err) => {
        console.log('Failed to load group details', err);
        this._groupDetails.set(null);
        return of(null);
      })
    );
  }

  postCreateGroup(name: string, description: string) {
    const body = {
      name: name,
      description: description,
    }
    return this._http.post<ICreatedGroup | IGroupErr>(this._CREATE, body).pipe();
  }

  postGroupAddMember(groupId: string, studentName: string) {
    const body = {
      group_id: groupId,
      student_username: studentName,
    };
    return this._http.post<IAddition | IGroupErr>(this._ADD, body).pipe();
  }





}


