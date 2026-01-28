import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { IAssignmentData, ICreateAssign, IExercise, IExerciseData, IProblem } from '../models/assignment.model';
import { IGroupErr } from '../models/group.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private _http = inject(HttpClient);

  private _assignmentURL = `${environment.apiUrl}/assignment/get`;
  private _exerciseURL = `${environment.apiUrl}/exercise/get`;
  private _CREATE = `${environment.apiUrl}/assignment/create-with-exercises`

  private _assignment = signal<IAssignmentData | null>(null);
  readonly assignment = this._assignment.asReadonly();

  private _exercises = signal<IExercise[]>([]);
  readonly exercises = this._exercises.asReadonly();

  getAssignmentById(id: string) {
    return this._http.get<IAssignmentData>(`${this._assignmentURL}/${id}`).pipe(
      tap((a) => this._assignment.set(a)),
      catchError((err) => {
        console.log('Failed to load assignment, using demo', err);
        this._assignment.set(this.demoAssignment(id));
        return of(null);
      })
    );
  }

  getExercisesByAssignment(assignmentId: string) {
    return this._http
      .get<IExerciseData[]>(`${this._exerciseURL}?parent_assignment=${assignmentId}`)
      .pipe(
        tap((rows) => {
          const mapped: IExercise[] = (rows ?? []).map((x) => ({
            title: x.name,
            points: 0,
            problem_id: x.cf_code,
          }));
          this._exercises.set(mapped);
        }),
        catchError((err) => {
          console.log('Failed to load exercises, using demo', err);
          this._exercises.set(this.demoExercises());
          return of(null);
        })
      );
  }

  loadAssignmentScreen(id: string) {
    return forkJoin([
      this.getAssignmentById(id),
      this.getExercisesByAssignment(id),
    ]);
  }

  private demoAssignment(id: string): IAssignmentData {
    return {
      _id: id,
      title: 'Week 1 - Greedy (demo)',
      description: 'placeholder (demo)',
      due_date: '2026-02-01T00:00:00.000Z',
      parent_group: '000000000000000000000000',
    };
  }

  private demoExercises(): IExercise[] {
    return [
      { title: 'placeholder', points: 5, problem_id: '10542' },
      { title: 'placeholder', points: 5, problem_id: '1054e' },
      { title: 'placeholder', points: 5, problem_id: '1054g' },
    ];
  }



  postCreateAssignment(name: string, desc: string, problems: string[], groupId: string, due: Date | null) {

    const dumb: IProblem[] = [];
    problems.forEach((p) => {
      const pre = {
        name: p,
        cf_code: p
      }
      dumb.push(pre);
    })

    const req = {
      title: name,
      description: desc,
      parent_group: groupId,
      due_date: due,
      exercises: dumb

    }
    return this._http.post<ICreateAssign | IGroupErr>(this._CREATE, req);

  }
}
