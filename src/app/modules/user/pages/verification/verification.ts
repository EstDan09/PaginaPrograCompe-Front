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

  user = this._auth.user;

  account = this._verification.account;
  startData = this._verification.startData;
  loading = this._verification.loading;
  error = this._verification.error;

  verifyToken = signal('');

  newHandle = signal('');

  remainingSec = signal<number | null>(null);
  private _timer: any = null;

  constructor() {
    effect(() => {
      if (this.user()) this._verification.loadMyAccount().subscribe();
    });

    effect(() => {
      const s = this.startData();
      if (!s?.verification_token) return;

      this.verifyToken.set(s.verification_token);
      this.startCountdown(120);
    });
  }

  ngOnDestroy() {
  this.clearCountdown();
}


  start() {
    this.verifyToken.set('');
    this.clearCountdown();

    this._verification.startVerify().subscribe();
  }

  end() {
  if (!this.startData()?.verification_token) return;

  this._verification.endVerify().subscribe((acc) => {
    if (acc) {
      this.verifyToken.set('');
      this.clearCountdown();
    }
  });
}


  updateHandle() {
    const acc = this.account();
    if (!acc) return;

    this._verification.updateHandle(acc._id, this.newHandle()).subscribe((updated) => {
      if (updated) this.newHandle.set('');
    });
  }

  private startCountdown(seconds: number) {
    this.clearCountdown();
    this.remainingSec.set(seconds);

    this._timer = setInterval(() => {
      const v = this.remainingSec();
      if (v === null) return;

      if (v <= 1) {
        this.remainingSec.set(0);
        this.clearCountdown();
        return;
      }

      this.remainingSec.set(v - 1);
    }, 1000);
  }

  private clearCountdown() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
  }

  mmss() {
    const s = this.remainingSec();
    if (s === null) return '02:00';
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }
}
