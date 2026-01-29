import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss',
})
export class CreateUser {
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
      cf_account: [''], // ✅ NEW (Codeforces handle)
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  ngOnInit() {
    // ✅ dynamic validators: require cf_account only for student
    this.createUserForm.get('role')!.valueChanges.subscribe((role) => {
      const cf = this.createUserForm.get('cf_account')!;
      if (role === 'student') {
        cf.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        cf.clearValidators();
        cf.setValue(''); // optional: clear if coach
      }
      cf.updateValueAndValidity();
    });

    // ensure it runs once for initial value
    const role = this.createUserForm.get('role')!.value;
    this.createUserForm.get('role')!.setValue(role as any, { emitEvent: true });
  }

  get passwordsMismatch(): boolean {
    return !!this.createUserForm.errors?.['passwordsMismatch'];
  }

  get isStudent(): boolean {
    return this.createUserForm.get('role')?.value === 'student';
  }

  onSubmit() {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const { username, password, role, email, cf_account } = this.createUserForm.value;

    const payload: {
      username: string;
      password: string;
      role: 'student' | 'coach';
      email?: string;
      cf_account?: string;
    } = {
      username: username!,
      password: password!,
      role: role as 'student' | 'coach',
      email: email!,
    };

    if (payload.role === 'student') {
      payload.cf_account = String(cf_account ?? '').trim();
    }

    this._authService.register(payload).subscribe((user) => {
      if (user) {
        this._router.navigate(['/auth/verification']);
      } else {
        console.log('Register failed');
      }
    });
  }

  goToLogin() {
    this._router.navigate(['/auth/login']);
  }
}
