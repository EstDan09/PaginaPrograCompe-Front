import { Component, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FollowingService } from '../../../../services/following.service';
import { IFollow } from '../../../../models/following-list.model';

@Component({
  selector: 'app-following',
  imports: [TranslateModule, RouterLink, SlicePipe],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  private _followingService = inject(FollowingService);
  private _translateService = inject(TranslateService);

  following = this._followingService.followingList;

  constructor() {
    this._followingService.getFollowing().subscribe((res) => {
      if (!res) console.log('FAILED TO LOAD FRIENDS');
    });
  }

  setLang(lang: 'es' | 'en') {
    this._translateService.use(lang);
  }

  displayName(f: IFollow): string {
    const raw = (f as any)?.student_2_id ?? (f as any)?.student2 ?? (f as any)?.to ?? '';
    const str = String(raw);
    return str.length ? str : 'unknown';
  }
}
