import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss',
})
export class CreateUser {
  private _translateService = inject(TranslateService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  private passwordsMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null; 

    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  createUserForm = this._formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      role: ['student', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  get passwordsMismatch(): boolean {
    return !!this.createUserForm.errors?.['passwordsMismatch'];
  }

  onSubmit() {
  if (this.createUserForm.invalid) {
    this.createUserForm.markAllAsTouched();
    return;
  }

  const { username, password, role, email } = this.createUserForm.value;

  this._authService.register({
    username: username!,
    password: password!,
    role: role as 'student' | 'coach',
    email: email!,
  }).subscribe((user) => {
    if (user) {
      this._router.navigate(['/user']);
    } else {
      console.log('Register failed');
    }
  });

}

  goToLogin() {
  this._router.navigate(['/auth']);
}

}
