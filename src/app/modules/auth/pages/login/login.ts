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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  setLang(lang: "es" | "en") {
    this._translateService.use(lang);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = this.loginForm.value;
    console.log('Email:', formData.email);
    console.log('Password:', formData.password);

    const loginSuccess = this._authService.login(formData.email!, formData.password!);
    if (loginSuccess) { 
      this._router.navigate(['/user']);
    }

    
  }

  onCreateAccount() {
    this._router.navigate(['/auth/create-user']);
  }
}
