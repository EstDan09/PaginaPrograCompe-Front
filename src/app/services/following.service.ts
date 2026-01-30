import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, finalize, of, tap } from 'rxjs';
import { IFollowingResponse, IFollowName } from '../models/following-list.model';

type CreateFollowingBody = {
  student_2_id: string;
  student_1_id?: string;
};

@Injectable({ providedIn: 'root' })
export class FollowingService {
  private _URL = `${environment.apiUrl}/following`;
  private _http = inject(HttpClient);

  private _followingList = signal<IFollowName[]>([]);
  readonly followingList = this._followingList.asReadonly();

  private _busy = signal(false);
  readonly busy = this._busy.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  clearError() {
    this._error.set(null);
  }

  private setError(err: any, fallback: string) {
    this._error.set(err?.error?.message ?? err?.message ?? fallback);
  }

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

  createFollowing(student2Id: string, student1Id?: string) {
    const body: CreateFollowingBody = { student_2_id: student2Id };
    if (student1Id) body.student_1_id = student1Id;

    this._busy.set(true);
    this._error.set(null);

    return this._http.post<any>(`${this._URL}/create`, body).pipe(
      catchError((err) => {
        console.log('[FollowingService] createFollowing error:', err);
        this.setError(err, 'Could not follow this user.');
        return of(null);
      }),
      finalize(() => this._busy.set(false))
    );
  }

  deleteFollowing(followingId: string) {
    const id = String(followingId ?? '').trim();
    if (!id) return of(null);

    this._busy.set(true);
    this._error.set(null);

    return this._http.delete<any>(`${this._URL}/delete/${id}`).pipe(
      catchError((err) => {
        console.log('[FollowingService] deleteFollowing error:', err);
        this.setError(err, 'Could not unfollow this user.');
        return of(null);
      }),
      finalize(() => this._busy.set(false))
    );
  }
}
