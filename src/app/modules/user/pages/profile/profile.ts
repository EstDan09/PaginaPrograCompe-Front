import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private _auth = inject(AuthService);

  user = this._auth.user;
  username = this._auth.username;
  email = this._auth.email;
  role = this._auth.role;

  editing = signal(false);
  saving = signal(false);
  msg = signal<string | null>(null);

  editEmail = signal('');
  editPassword = signal('');

  roleLabel = computed(() => {
    const r = this.role();
    if (r === 'student') return 'Student';
    if (r === 'coach') return 'Coach';
    return String(r ?? '—');
  });

  openEdit() {
    this.msg.set(null);
    this.editEmail.set(this.email());
    this.editPassword.set('');
    this.editing.set(true);
  }

  cancelEdit() {
    this.msg.set(null);
    this.editPassword.set('');
    this.editing.set(false);
  }

  save() {
    this.msg.set(null);

    const email = this.editEmail().trim();
    const password = this.editPassword().trim();

    this.saving.set(true);

    this._auth.updateMe({ email, password }).subscribe((res) => {
      this.saving.set(false);

      if (!res) {
        this.msg.set('Could not update your profile.');
        return;
      }

      this.msg.set('Profile updated.');
      this.editPassword.set('');
      this.editing.set(false);
    });
  }
}
