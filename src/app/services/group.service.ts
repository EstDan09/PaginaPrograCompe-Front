import { inject, Injectable, signal } from '@angular/core';
import { IGroup, IGroupData, IGroupDetails, IMyGroupSummary } from '../models/group.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class GroupService {

  _URL = `${environment.apiUrl}/student-group/get`;
  _ALTER = `${environment.apiUrl}/group/get`;
  _http: HttpClient = inject(HttpClient);

  private _groupList = signal<IGroup[] | null>(null);
  readonly groupList = this._groupList.asReadonly();

  private _group = signal<IGroupData | null>(null);
  readonly group = this._group.asReadonly();

  private _summaryURL = `${environment.apiUrl}/student-group/my-groups-summary`;

  private _myGroupsSummary = signal<IMyGroupSummary[] | null>(null);
  readonly myGroupsSummary = this._myGroupsSummary.asReadonly();

  private _groupDetailsURL = `${environment.apiUrl}/group/details/get`;
  private _groupDetails = signal<IGroupDetails | null>(null);
  readonly groupDetails = this._groupDetails.asReadonly();

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

  getMyGroupsSummaryDemo() {
    const demoData: IMyGroupSummary[] = [
      {
        groupId: '1',
        name: 'Algorithm analysis',
        owner: 'eddituss',
        membersCount: 23,
        role: 'Student',
        dueAssignments: 2,
      },
      {
        groupId: '2',
        name: 'Todo es mental',
        owner: 'Fisher',
        membersCount: 5,
        role: 'Student',
        dueAssignments: 0,
      },
      {
        groupId: '3',
        name: 'POO',
        owner: 'zenidog',
        membersCount: 15,
        role: 'Student',
        dueAssignments: 3,
      },
      {
        groupId: '4',
        name: 'Algorithm analysis',
        owner: 'eddituss',
        membersCount: 23,
        role: 'Student',
        dueAssignments: 2,
      },
    ];

    // Simula "respuesta de API"
    this._myGroupsSummary.set(demoData);

    // Devolvemos observable para que el componente no cambie
    return of(demoData);
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

  getGroupDetailsDemo(id: string) {
    const demo: IGroupDetails = {
      group: {
        _id: id,
        name: 'Algorithm analysis',
        description: 'Grupo demo mientras se habilita el endpoint.',
        owner: {
          _id: 'coach_1',
          username: 'eddituss',
          role: 'coach',
        },
      },
      assignments: [
        {
          _id: '0',
          title: 'Week 1 - Greedy',
          description: 'Resolver 10 problemas greedy',
          due_date: '2026-02-01T00:00:00.000Z',
          exerciseCount: 3,
        },
        {
          _id: 'a2',
          title: 'Week 2 - DP',
          description: null,
          due_date: null,
          exerciseCount: 0,
        },
      ],
    };

    this._groupDetails.set(demo);
    return of(demo);
  }



}


