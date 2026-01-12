import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { VerificationService } from '../../../../services/verification.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.html',
  styleUrl: './verification.scss',
})
export class Verification {

  private _auth = inject(AuthService);
  private _verification = inject(VerificationService);

  // auth
  user = this._auth.user;

  // service state
  account = this._verification.account;
  startData = this._verification.startData;
  loading = this._verification.loading;
  error = this._verification.error;
  isVerified = this._verification.isVerified;

  // ui inputs
  verifyToken = signal('');
  newHandle = signal('');

  constructor() {
    // cuando haya sesión, cargar CF account
    effect(() => {
      if (this.user()) {
        this._verification.loadMyAccount().subscribe();
      }
    });
  }

  start() {
    this._verification.startVerify().subscribe();
  }

  end() {
    this._verification.endVerify(this.verifyToken()).subscribe((acc) => {
      if (acc) this.verifyToken.set('');
    });
  }

  updateHandle() {
    const acc = this.account();
    if (!acc) return;
    this._verification.updateHandle(acc._id, this.newHandle()).subscribe((updated) => {
      if (updated) this.newHandle.set('');
    });
  }
}
