import { Component, Inject, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../../../../services/stats.service';
import { IStatsMeResponse } from '../../../../../models/stats.model';
import { catchError, of, tap } from 'rxjs';

type DialogData = { userId: string; username: string };

@Component({
  selector: 'app-following-profile-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterLink],
  templateUrl: './following-profile-dialog.html',
  styleUrl: './following-profile-dialog.scss',
})
export class FollowingProfileDialog {
  private _ref = inject(MatDialogRef<FollowingProfileDialog>);
  private _stats = inject(StatsService);

  loading = signal(true);
  error = signal<string | null>(null);

  username = signal('');
  data = signal<IStatsMeResponse | null>(null);

  rating = computed(() => this.data()?.kpis.rating ?? null);
  solved = computed(() => this.data()?.kpis.solvedTotal ?? null);
  streak = computed(() => this.data()?.kpis.streakDays ?? null);

  cfHandle = computed(() => this.data()?.user.cfHandle ?? this.username());
  role = computed(() => this.data()?.user.role ?? 'student');

  topTags = computed(() => {
    const tags = this.data()?.tags ?? [];
    return [...tags].sort((a, b) => b.solved - a.solved).slice(0, 6);
  });

  constructor(@Inject(MAT_DIALOG_DATA) public dlg: DialogData) {
    this.username.set(dlg.username);

    console.log('[FollowingProfileDialog] opening for:', {
      username: dlg.username,
      userId: dlg.userId,
    });

    // importante: arrancar en loading
    this.loading.set(true);
    this.error.set(null);
    this.data.set(null);

    this._stats
      .getStudentStatsOnce(dlg.userId, 'all')
      .pipe(
        tap((res) => {
          console.log('[FollowingProfileDialog] stats response:', res);
        }),
        catchError((err) => {
          console.log('[FollowingProfileDialog] failed to load stats:', err);
          const msg =
            err?.error?.message ??
            err?.message ??
            'Couldn’t load stats for this user.';
          this.error.set(msg);
          return of(null); // 👈 NO mock
        })
      )
      .subscribe((res) => {
        if (res) this.data.set(res);
        this.loading.set(false);
      });
  }

  close() {
    this._ref.close();
  }
}
