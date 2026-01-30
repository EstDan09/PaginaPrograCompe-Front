import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IChallenge, IAskChallengeResponse } from '../models/challenge.model';

type GetChallengesResponse = { challenges: IChallenge[] };
type CreateChallengeResponse = { message: string; challenge: IChallenge };


@Injectable({ providedIn: 'root' })
export class ChallengeService {
  private _http = inject(HttpClient);

  private _challenges = signal<IChallenge[]>([]);
  challenges = this._challenges.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  private _askLoading = signal(false);
  askLoading = this._askLoading.asReadonly();

  private _askError = signal<string | null>(null);
  askError = this._askError.asReadonly();

  private _asked = signal<IAskChallengeResponse | null>(null);
  asked = this._asked.asReadonly();

  clearAskState() {
    this._askError.set(null);
    this._asked.set(null);
  }

  refreshMyChallenges() {
    this._loading.set(true);
    this._error.set(null);

    return this._http.get<GetChallengesResponse>(`${environment.apiUrl}/challenge/get`).pipe(
      tap(res => this._challenges.set(res.challenges ?? [])),
      tap(() => this._loading.set(false)),
      catchError((err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'No se pudieron cargar los challenges');
        return of(null);
      })
    );
  }

  createChallenge(cf_code: string) {
    this._error.set(null);

    return this._http.post<CreateChallengeResponse>(
      `${environment.apiUrl}/challenge/create`,
      { cf_code }
    ).pipe(
      tap(res => {
        this._challenges.update(list => [res.challenge, ...list]);
      }),
      map(res => res.challenge),
      catchError((err) => {
        this._error.set(err?.error?.message ?? 'No se pudo crear el challenge');
        return of(null);
      })
    );
  }

  verifyChallenge(challengeId: string) {
    this._error.set(null);

    return this._http.put<IChallenge>(
      `${environment.apiUrl}/challenge/verify/${challengeId}`,
      {}
    ).pipe(
      tap(updated => {
        this._challenges.update(list =>
          list.map(c => (c._id === updated._id ? updated : c))
        );
      }),
      catchError((err) => {
        this._error.set(err?.error?.message ?? 'No se pudo verificar el challenge');
        return of(null);
      })
    );
  }

  deleteChallenge(challengeId: string) {
    this._error.set(null);

    return this._http.delete<{ message: string }>(
      `${environment.apiUrl}/challenge/delete/${challengeId}`
    ).pipe(
      tap(() => {
        this._challenges.update(list => list.filter(c => c._id !== challengeId));
      }),
      catchError((err) => {
        this._error.set(err?.error?.message ?? 'No se pudo eliminar el challenge');
        return of(null);
      })
    );
  }

  askChallenge(opts?: { min_rating?: number; max_rating?: number; tags?: string }) {
    this._askLoading.set(true);
    this._askError.set(null);

    const params: any = {};
    const min = opts?.min_rating;
    const max = opts?.max_rating;
    const tags = (opts?.tags ?? '').trim();

    if (typeof min === 'number' && !Number.isNaN(min)) params.min_rating = min;
    if (typeof max === 'number' && !Number.isNaN(max)) params.max_rating = max;
    if (tags) params.tags = tags;

    return this._http.get<IAskChallengeResponse>(`${environment.apiUrl}/challenge/ask`, { params }).pipe(
      tap((res) => this._asked.set(res)),
      catchError((err) => {
        this._askError.set(err?.error?.message ?? 'Could not fetch a random challenge');
        this._asked.set(null);
        return of(null);
      }),
      tap(() => this._askLoading.set(false))
    );
  }

  pending = computed(() => this._challenges().filter(c => !c.is_completed_flag));
  completed = computed(() => this._challenges().filter(c => c.is_completed_flag));
}
