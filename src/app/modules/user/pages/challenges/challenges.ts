import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ChallengeService } from '../../../../services/challenge.service';
import { IChallenge } from '../../../../models/challenge.model';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.html',
  styleUrl: './challenges.scss',
})
export class Challenges {
  private _auth = inject(AuthService);
  private _challengesSvc = inject(ChallengeService);

  user = this._auth.user;

  newCode = signal('');
  localMsg = signal<string | null>(null);

  loading = this._challengesSvc.loading;
  error = this._challengesSvc.error;

  pendingChallenges = this._challengesSvc.pending;
  completedChallenges = this._challengesSvc.completed;

  // ✅ ask state from service
  askLoading = this._challengesSvc.askLoading;
  askError = this._challengesSvc.askError;
  asked = this._challengesSvc.asked;

  // ✅ filters for ask
  minRating = signal<number | null>(800);
  maxRating = signal<number | null>(1400);
  tags = signal(''); // "dp,greedy" etc.

  constructor() {
    effect(() => {
      if (this.user()) {
        this._challengesSvc.refreshMyChallenges().subscribe();
      }
    });
  }

  addChallenge() {
    this.localMsg.set(null);
    const code = this.newCode().trim();

    if (!this.user()) {
      this.localMsg.set('No hay sesión activa.');
      return;
    }
    if (!code) {
      this.localMsg.set('Ingresá un código (ej: 1230A).');
      return;
    }

    this._challengesSvc.createChallenge(code).subscribe((created) => {
      if (created) {
        this.newCode.set('');
        this.localMsg.set('Reto agregado a pendientes ✅');
      }
    });
  }

  markAsCompleted(id: string) {
    this._challengesSvc.verifyChallenge(id).subscribe();
  }

  askRandom() {
    this.localMsg.set(null);
    this._challengesSvc.clearAskState();

    const min = this.minRating();
    const max = this.maxRating();

    this._challengesSvc.askChallenge({
      min_rating: typeof min === 'number' ? min : undefined,
      max_rating: typeof max === 'number' ? max : undefined,
      tags: this.tags().trim() || undefined,
    }).subscribe();
  }

  addAskedToPending() {
    const a = this.asked();
    if (!a?.cf_code) return;

    this._challengesSvc.createChallenge(a.cf_code).subscribe((created) => {
      if (created) {
        this.localMsg.set(`Added ${a.cf_code} to pending ✅`);
      }
    });
  }

  setMinRating(v: string) {
    const n = Number(v);
    this.minRating.set(Number.isFinite(n) ? n : null);
  }

  setMaxRating(v: string) {
    const n = Number(v);
    this.maxRating.set(Number.isFinite(n) ? n : null);
  }

  cfProblemUrl(a: { contestId?: number; cf_code?: string } | null): string | null {
    if (!a?.contestId || !a?.cf_code) return null;

    const contest = String(a.contestId);
    const code = String(a.cf_code).trim();

    const index = code.startsWith(contest) ? code.slice(contest.length) : code.replace(contest, '');
    const cleanIndex = index.trim();

    if (!cleanIndex) return null;

    return `https://codeforces.com/problemset/problem/${a.contestId}/${cleanIndex}`;
  }
}
