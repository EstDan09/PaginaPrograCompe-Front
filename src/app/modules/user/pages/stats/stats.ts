import { Component, computed, effect, inject } from '@angular/core';
import { StatsService } from '../../../../services/stats.service';
import { TimeChart } from './graphs/time-chart/time-chart';
import { BarChart } from './graphs/bar-chart/bar-chart';
import { AuthService } from '../../../../services/auth.service';

type TagStat = { tag: string; solved: number };
type SolveBin = { label: string; solved: number };

@Component({
  selector: 'app-stats',
  imports: [TimeChart, BarChart],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  private _statsService = inject(StatsService);
  private _authService = inject(AuthService);

  userId = this._authService.userId;

  data = this._statsService.stats;
  loading = this._statsService.loading;
  error = this._statsService.error;

  // KPIs (solo cuando hay data)
  rating = computed(() => this.data()?.kpis.rating);
  solved = computed(() => this.data()?.kpis.solvedTotal);
  streakDays = computed(() => this.data()?.kpis.streakDays);

  // series
  solvesByRating = computed<SolveBin[]>(() =>
    (this.data()?.solvesByRating.bins ?? []).map(b => ({ label: b.label, solved: b.solved }))
  );

  tags = computed<TagStat[]>(() => this.data()?.tags ?? []);

  constructor() {
    effect(() => {
      const id = this.userId();

      if (!id || id === 'none') return;

      this._statsService.getStudentStats(id, 'all').subscribe(() => {
        const d = this.data();
        console.log('=== [Stats Component] DATA AFTER LOAD ===');
        console.log(d);
        console.log('[Stats] ratingGraph:', d?.ratingGraph);
        console.log('[Stats] series length:', d?.ratingGraph?.series?.length);
      });

    });
  }
}
