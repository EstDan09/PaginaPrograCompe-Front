import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private _authService = inject(AuthService);

  user = this._authService.user;

  username = this._authService.username;
  email = this._authService.email;
  role = this._authService.role;
  userId = this._authService.userId;
  groups = this._authService.groups;

  groupsCount = computed(() => this.groups().length);
}
