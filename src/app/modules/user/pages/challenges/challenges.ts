import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ChallengeService } from '../../../../services/challenge.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.html',
  styleUrl: './challenges.scss',
})
export class Challenges {

  private _auth = inject(AuthService);
  private _challengesSvc = inject(ChallengeService);

  user = this._auth.user;

  // estado del add
  newCode = signal('');
  localMsg = signal<string | null>(null);

  // expongo signals del service para la UI
  loading = this._challengesSvc.loading;
  error = this._challengesSvc.error;

  pendingChallenges = this._challengesSvc.pending;
  completedChallenges = this._challengesSvc.completed;

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
    // ahora no es local: pega al endpoint verify
    this._challengesSvc.verifyChallenge(id).subscribe();
  }
}
