import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { GroupService } from '../../../../services/group.service';
import { StatsService } from '../../../../services/stats.service';
import { FollowingService } from '../../../../services/following.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private _authService = inject(AuthService);
  private _groupService = inject(GroupService);
  private _statsService = inject(StatsService);
  private _followingService = inject(FollowingService);

  user = this._authService.user;

  username = this._authService.username;
  email = this._authService.email;
  role = this._authService.role;
  userId = this._authService.userId;

  groupList = this._groupService.groupList;
  groupsCount = computed(() => this.groupList()?.length ?? 0);

  // ✅ stats reales
  stats = this._statsService.stats;
  rating = computed(() => this.stats()?.kpis.rating ?? null);

  // ✅ following real (cuenta)
  followingList = this._followingService.followingList;
  following = computed(() => this.followingList().length);

  // ❗ followers: ponelo null hasta que exista endpoint real
  followers = computed(() => null as number | null);

  constructor() {
    effect(() => {
      const u = this.user();
      const id = this.userId();

      if (!u || !id || id === 'none') return;

      // grupos
      this._groupService.getMyGroups().subscribe();

      // rating real
      this._statsService.getStudentStats(id, 'all').subscribe();

      // following real
      this._followingService.getFollowing().subscribe();
    });
  }
}
