import { Component, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FollowingService } from '../../../../services/following.service';

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
    this._followingService.getFollowing().subscribe();
  }

  setLang(lang: 'es' | 'en') {
    this._translateService.use(lang);
  }

  safeName(name: unknown): string {
    const s = String(name ?? '').trim();
    return s.length ? s : 'unknown';
  }
}
