import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IStatsMeResponse } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private _http = inject(HttpClient);
  private _URL = `${environment.apiUrl}/stats/me`;

  private _stats = signal<IStatsMeResponse | null>(null);
  readonly stats = this._stats.asReadonly();

  getMe(range: 'all' | '90d' | '30d' | '7d' = 'all') {
    return this._http.get<IStatsMeResponse>(`${this._URL}?range=${range}`).pipe(
      tap((res) => this._stats.set(res)),
      catchError((err) => {
        console.log('Failed to load /stats/me, using demo', err);
        this._stats.set(this.demoPayload());
        return of(null);
      })
    );
  }

  getMeDemo() {
    this._stats.set(this.demoPayload());
    return of(this._stats());
  }

  private demoPayload(): IStatsMeResponse {
    return {
      user: {
        userId: '65a1f8c1b1c2d3e4f5a6b7c8',
        cfHandle: 'student_cf',
        role: 'student',
      },
      kpis: {
        rating: 1203,
        solvedTotal: 1243,
        streakDays: 6,
      },
      ratingGraph: {
        min: 820,
        max: 1120,
        series: [
          { t: '2025-08-01', rating: 820 },
          { t: '2025-08-15', rating: 910 },
          { t: '2025-09-01', rating: 860 },
          { t: '2025-09-15', rating: 880 },
          { t: '2025-10-01', rating: 940 },
          { t: '2025-10-20', rating: 980 },
          { t: '2025-11-01', rating: 900 },
          { t: '2025-11-15', rating: 870 },
          { t: '2025-12-01', rating: 860 },
          { t: '2025-12-20', rating: 930 },
          { t: '2026-01-01', rating: 1010 },
          { t: '2026-01-10', rating: 1040 },
          { t: '2026-01-14', rating: 1080 },
          { t: '2026-01-18', rating: 1120 },
          { t: '2026-01-20', rating: 1100 },
        ],
      },
      solvesByRating: {
        binSize: 100,
        bins: [
          { from: 800, to: 899, label: '800', solved: 300 },
          { from: 900, to: 999, label: '900', solved: 130 },
          { from: 1000, to: 1099, label: '1000', solved: 160 },
          { from: 1100, to: 1199, label: '1100', solved: 60 },
          { from: 1200, to: 1299, label: '1200', solved: 100 },
          { from: 1300, to: 1399, label: '1300', solved: 125 },
          { from: 1400, to: 1499, label: '1400', solved: 70 },
          { from: 1500, to: 1599, label: '1500', solved: 50 },
          { from: 1600, to: 1699, label: '1600', solved: 30 },
          { from: 1700, to: 1799, label: '1700', solved: 12 },
          { from: 1800, to: 1899, label: '1800', solved: 7 },
          { from: 1900, to: 1999, label: '1900', solved: 3 },
        ],
      },
      tags: [
        { tag: 'implementation', solved: 453 },
        { tag: 'binary search', solved: 420 },
        { tag: 'greedy', solved: 524 },
        { tag: 'math', solved: 32 },
        { tag: 'fft', solved: 69 },
        { tag: 'graphs', solved: 532 },
      ],
      meta: {
        generatedAt: '2026-01-21T16:02:10Z',
        source: 'demo',
        cacheTtlSeconds: 3600,
      },
    };
  }
}
