import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { GroupService } from '../../../../services/group.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private _authService = inject(AuthService);
  private _groupService = inject(GroupService);

  user = this._authService.user;

  username = this._authService.username;
  email = this._authService.email;
  role = this._authService.role;
  userId = this._authService.userId;

  groupList = this._groupService.groupList;
  groupsCount = computed(() => this.groupList()?.length ?? 0);

  rating = computed(() => 3978);
  following = computed(() => 23);
  followers = computed(() => 1980);

  constructor() {
    effect(() => {
      if (this.user()) {
        this._groupService.getMyGroups().subscribe();
      }
    });
  }
}
