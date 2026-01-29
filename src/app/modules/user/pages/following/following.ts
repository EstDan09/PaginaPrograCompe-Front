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
    console.log(this.following());
  }

  setLang(lang: 'es' | 'en') {
    this._translateService.use(lang);
  }

  safeName(name: unknown): string {
    const s = String(name ?? '').trim();
    return s.length ? s : 'unknown';
  }

  openProfile(f: IFollowName) {
    console.log(this.following()); //aca si simprime nombre y id

    console.log(f.student_id); //aca sale el id undefined

    this._dialog.open(FollowingProfileDialog, {
      width: '720px',
      maxWidth: '100vw',
      panelClass: 'cf-profile-dialog',
      data: {
        userId: f.student_id,
        username: this.safeName(f.name),
      },
    });
  }
}
