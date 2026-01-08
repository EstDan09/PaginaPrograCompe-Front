import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';



@Component({
  selector: 'app-login',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _translateService = inject(TranslateService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  loginForm = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  setLang(lang: "es" | "en") {
    this._translateService.use(lang);
  }

  onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { username, password } = this.loginForm.value;

  this._authService.login(username!, password!).subscribe((user) => {
    if (user) {
      this._router.navigate(['/user']);
    } else {
      console.log('Credenciales inválidas');
    }
  });
}

  onCreateAccount() {
    this._router.navigate(['/auth/create-user']);
  }
}
