import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {
  private _authService = inject(AuthService);

  user = this._authService.user;
  role = this._authService.role;

  myGroupsLink = computed(() => ['/user', 'my-groups']);
  myStatsLink = computed(() => ['/user', 'stats']);
  myFollowsLink = computed(() => ['/user', 'following']);

  onLogout() {
    this._authService.logout();
  }
}
