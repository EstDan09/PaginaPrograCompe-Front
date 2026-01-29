import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICFAccount, StartVerifyResponse } from '../models/cfaccount.model';

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private _http = inject(HttpClient);

  // state
  private _account = signal<ICFAccount | null>(null);
  readonly account = this._account.asReadonly();

  private _startData = signal<StartVerifyResponse | null>(null);
  readonly startData = this._startData.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  // derived
  readonly isVerified = computed(() => this._account()?.is_verified_flag === true);
  readonly hasAccount = computed(() => this._account() !== null);

  // helpers
  clearMessages() {
    this._error.set(null);
  }

  clearStartData() {
    this._startData.set(null);
  }

  reset() {
    this._account.set(null);
    this._startData.set(null);
    this._error.set(null);
    this._loading.set(false);
  }

  // API
  loadMyAccount() {
    this._loading.set(true);
    this._error.set(null);

    return this._http.get<ICFAccount>(`${environment.apiUrl}/cfaccount/me`).pipe(
      tap((acc) => {
        console.log('[VerificationService] /cfaccount/me response:', acc);
        this._account.set(acc);
      }),
      catchError((err) => {
        console.log('[VerificationService] /cfaccount/me error:', err);
        this._error.set(err?.error?.message ?? 'Could not load your Codeforces account.');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Step 1:
   * - Starts verification and returns:
   *   - verification_token
   *   - cf_code (problem to submit a Compilation Error to)
   *
   * UI: show instruction + show token (read-only), and enable "Finish verification".
   */
  startVerify() {
    this._loading.set(true);
    this._error.set(null);

    return this._http.get<StartVerifyResponse>(`${environment.apiUrl}/cfaccount/start_verify`).pipe(
      tap((data) => {
        console.log('[VerificationService] /cfaccount/start_verify response:', data);
        this._startData.set(data);
      }),
      catchError((err) => {
        console.log('[VerificationService] /cfaccount/start_verify error:', err);
        this._error.set(err?.error?.message ?? 'Could not start verification.');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Step 2 (new UX):
   * - User DOES NOT type the token.
   * - Component should call endVerify() with token from startData.verification_token.
   */
  endVerify() {
    const token = (this._startData()?.verification_token ?? '').trim();

    if (!token) {
      this._error.set('Start verification first (no token generated yet).');
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this._http
      .put<ICFAccount>(
        `${environment.apiUrl}/cfaccount/end_verify/${encodeURIComponent(token)}`,
        {}
      )
      .pipe(
        tap((acc) => {
          console.log('[VerificationService] /cfaccount/end_verify response:', acc);
          this._account.set(acc);
          this._startData.set(null); // clear flow after success
        }),
        catchError((err) => {
          console.log('[VerificationService] /cfaccount/end_verify error:', err);
          this._error.set(err?.error?.message ?? 'Could not finish verification.');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      );
  }

  /**
   * Update handle (optional, same as before).
   * Recommended: clear startData so user restarts verification with the new handle.
   */
  updateHandle(id: string, cf_account: string) {
    const handle = cf_account.trim();
    if (!handle) {
      this._error.set('Enter your Codeforces handle.');
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this._http
      .put<ICFAccount>(`${environment.apiUrl}/cfaccount/update/${id}`, { cf_account: handle })
      .pipe(
        tap((acc) => {
          console.log('[VerificationService] /cfaccount/update response:', acc);
          this._account.set(acc);
          this._startData.set(null); // important: handle changed → restart verification flow
        }),
        catchError((err) => {
          console.log('[VerificationService] /cfaccount/update error:', err);
          this._error.set(err?.error?.message ?? 'Could not update handle.');
          return of(null);
        }),
        finalize(() => this._loading.set(false))
      );
  }
}
