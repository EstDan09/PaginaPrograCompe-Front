import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ChallengeService } from '../../../../services/challenge.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.html',
  styleUrl: './challenges.scss',
})
export class Challenges {

  private _authService = inject(AuthService);
  private _challengeService = inject(ChallengeService);

  user = this._authService.user;
  userId = this._authService.userId;

  challenges = computed(() =>
    this.user()
      ? this._challengeService.getByStudentId(this.userId())
      : []
  );

  pendingChallenges = computed(() =>
    this.challenges().filter(c => !c.is_completed_flag)
  );

  completedChallenges = computed(() =>
    this.challenges().filter(c => c.is_completed_flag)
  );

  markAsCompleted(id: string) {
    this._challengeService.markAsCompleted(id);
  }
}
