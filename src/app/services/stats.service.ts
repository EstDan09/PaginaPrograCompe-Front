import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { IStatsMeResponse } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private _http = inject(HttpClient);
  private _URL = `${environment.apiUrl}/stats/get-student-stats`;

  private _stats = signal<IStatsMeResponse | null>(null);
  readonly stats = this._stats.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  /** Limpia estado (útil al cambiar de usuario/rango) */
  reset() {
    this._stats.set(null);
    this._error.set(null);
    this._loading.set(false);
  }

  getStudentStats(
    studentId: string,
    range: 'all' | '90d' | '30d' | '7d' = 'all'
  ) {
    this._loading.set(true);
    this._error.set(null);
    this._stats.set(null);
    return this._http
      .get<IStatsMeResponse>(`${this._URL}/${studentId}?range=${range}`)
      .pipe(
        tap((res) => {
          console.log('=== [StatsService] RAW RESPONSE ===');
          console.log(res);

          console.log('[StatsService] ratingGraph:', res?.ratingGraph);
          console.log('[StatsService] series length:', res?.ratingGraph?.series?.length);
          console.log('[StatsService] series sample:', res?.ratingGraph?.series?.slice?.(0, 2));

          this._stats.set(res);
        }),
        catchError((err) => {
          const msg =
            err?.error?.message ??
            err?.message ??
            'No se pudieron cargar las estadísticas';
          this._error.set(msg);
          // NO usamos demo acá
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      );
  }

  /** Solo si vos querés demo manualmente (por dev) */
  setDemo(payload: IStatsMeResponse) {
    this._stats.set(payload);
  }
}
