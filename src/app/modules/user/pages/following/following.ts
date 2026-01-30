import { Component, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FollowingService } from '../../../../services/following.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FollowingProfileDialog } from './following-profile-dialog/following-profile-dialog';
import { IFollowName } from '../../../../models/following-list.model';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-following',
  imports: [TranslateModule, SlicePipe, MatDialogModule],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  private _followingService = inject(FollowingService);
  private _translateService = inject(TranslateService);
  private _dialog = inject(MatDialog);
  private _users = inject(UserService);
  private _auth = inject(AuthService);

  following = this._followingService.followingList;

  query = signal('');
  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.following() ?? [];
    if (!q) return list;

    return list.filter((f) => {
      const name = this.safeName(f.name).toLowerCase();
      const sid = String((f as any).student_id ?? '').toLowerCase();
      return name.includes(q) || sid.includes(q);
    });
  });

  followUsername = signal('');
  followBusy = this._followingService.busy;

  followError = signal<string | null>(null);
  followOk = signal<string | null>(null);

  unfollowBusyId = signal<string | null>(null);
  unfollowError = signal<string | null>(null);
  unfollowOk = signal<string | null>(null);

  constructor() {
    this._followingService.getFollowing().subscribe();
  }

  setLang(lang: 'es' | 'en') {
    this._translateService.use(lang);
  }

  safeName(name: unknown): string {
    const s = String(name ?? '').trim();
    return s.length ? s : 'unknown';
  }

  followRelId(f: IFollowName): string {
    const anyF = f as any;
    return String(anyF._id ?? anyF.following_id ?? anyF.id ?? '');
  }

  trackFollow(f: IFollowName): string {
    const rel = this.followRelId(f);
    return rel || String((f as any).student_id ?? this.safeName(f.name));
  }


  isUnfollowBusy(f: IFollowName): boolean {
    const rel = this.followRelId(f);
    return !!rel && this.unfollowBusyId() === rel;
  }

  openProfile(f: IFollowName) {
    this._dialog.open(FollowingProfileDialog, {
      width: '720px',
      maxWidth: '100vw',
      panelClass: 'cf-profile-dialog',
      data: {
        userId: (f as any).student_id,
        username: this.safeName(f.name),
      },
    });
  }

  clearSearch() {
    this.query.set('');
  }

  clearFollowMessages() {
    this.followError.set(null);
    this.followOk.set(null);
  }

  clearUnfollowMessages() {
    this.unfollowError.set(null);
    this.unfollowOk.set(null);
  }

  follow() {
    this.clearFollowMessages();

    const u = this.followUsername().trim();
    if (!u) {
      this.followError.set('Enter a username.');
      return;
    }

    this._users.getByUsername(u).subscribe((target) => {
      if (!target?._id) {
        this.followError.set('User not found.');
        return;
      }

      const myId = this._auth.userId();
      if (myId && myId !== 'none' && target._id === myId) {
        this.followError.set("You can't follow yourself.");
        return;
      }

      this._followingService.createFollowing(target._id).subscribe((res) => {
        if (!res) {
          this.followError.set(this._followingService.error() ?? 'Could not follow this user.');
          return;
        }

        this.followOk.set(`Now following @${target.username}`);
        this.followUsername.set('');
        this._followingService.getFollowing().subscribe();
      });
    });
  }

  unfollow(f: IFollowName) {
    this.clearUnfollowMessages();

    const followId = this.followRelId(f);
    if (!followId) {
      this.unfollowError.set(
        'no hay id pa'
      );
      return;
    }

    this.unfollowBusyId.set(followId);

    this._followingService.deleteFollowing(followId).subscribe((res) => {
      this.unfollowBusyId.set(null);

      if (!res) {
        this.unfollowError.set(this._followingService.error() ?? 'Could not unfollow this user.');
        return;
      }

      this.unfollowOk.set(`Unfollowed ${this.safeName(f.name)}`);
      this._followingService.getFollowing().subscribe();
    });
  }
}
