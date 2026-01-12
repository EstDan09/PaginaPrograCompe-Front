import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICFAccount, StartVerifyResponse } from '../models/cfaccount.model';

@Injectable({ providedIn: 'root' })
export class VerificationService {

  private _http = inject(HttpClient);

  private _account = signal<ICFAccount | null>(null);
  account = this._account.asReadonly();

  private _startData = signal<StartVerifyResponse | null>(null);
  startData = this._startData.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  isVerified = computed(() => this._account()?.is_verified_flag === true);
  hasAccount = computed(() => this._account() !== null);

  clearMessages() {
    this._error.set(null);
  }

  clearStartData() {
    this._startData.set(null);
  }

  loadMyAccount() {
    this._loading.set(true);
    this._error.set(null);

    return this._http.get<ICFAccount>(`${environment.apiUrl}/cfaccount/me`).pipe(
      tap(acc => this._account.set(acc)),
      tap(() => this._loading.set(false)),
      catchError((err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'No se pudo cargar tu cuenta de Codeforces');
        return of(null);
      })
    );
  }

  startVerify() {
    this._loading.set(true);
    this._error.set(null);

    return this._http.get<StartVerifyResponse>(`${environment.apiUrl}/cfaccount/start_verify`).pipe(
      tap(data => this._startData.set(data)),
      tap(() => this._loading.set(false)),
      catchError((err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'No se pudo iniciar la verificación');
        return of(null);
      })
    );
  }

  endVerify(verifyToken: string) {
    const token = verifyToken.trim();
    if (!token) {
      this._error.set('Ingresá el verification token.');
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this._http.put<ICFAccount>(
      `${environment.apiUrl}/cfaccount/end_verify/${encodeURIComponent(token)}`,
      {}
    ).pipe(
      tap(acc => {
        this._account.set(acc);
        this._startData.set(null); // ya no lo ocupamos
      }),
      tap(() => this._loading.set(false)),
      catchError((err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'No se pudo completar la verificación');
        return of(null);
      })
    );
  }

  updateHandle(id: string, cf_account: string) {
    const handle = cf_account.trim();
    if (!handle) {
      this._error.set('Ingresá tu handle de Codeforces.');
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this._http.put<ICFAccount>(
      `${environment.apiUrl}/cfaccount/update/${id}`,
      { cf_account: handle }
    ).pipe(
      tap(acc => this._account.set(acc)),
      tap(() => this._loading.set(false)),
      catchError((err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'No se pudo actualizar el handle');
        return of(null);
      })
    );
  }
}
