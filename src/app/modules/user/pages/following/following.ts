import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService, TranslateModule } from '@ngx-translate/core';
import { IFollowingList, IFollow } from '../../../../models/following-list.model';
import { FollowingService } from '../../../../services/following.service';

@Component({
  selector: 'app-following',
  imports: [TranslateModule],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _followingService: FollowingService = inject(FollowingService);
  private _translateService = inject(TranslateService);
  following = this._followingService.followingList;
  test: string[] = ["hola", "fuck", "you"];

  setLang(lang: "es" | "en") {
    this._translateService.use(lang);
  }


  constructor() {
    this._followingService.getFollowing().subscribe((following) => {
      if (!following) {
        console.log("FAILED TO LOAD FRIENDS");
      }
    });
  }

}
