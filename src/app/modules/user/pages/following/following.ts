import { Component, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FollowingService } from '../../../../services/following.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FollowingProfileDialog } from './following-profile-dialog/following-profile-dialog';
import { IFollowName } from '../../../../models/following-list.model';

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

  following = this._followingService.followingList;

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

  openProfile(f: IFollowName) {
    this._dialog.open(FollowingProfileDialog, {
      width: '520px',
      maxWidth: '92vw',
      data: {
        userId: f._id,
        username: this.safeName(f.name),
      },
    });
  }
}
