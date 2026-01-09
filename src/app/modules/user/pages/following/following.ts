import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IFollowingList } from '../../../../models/following-list.model';
import { FollowingService } from '../../../../services/following.service';

@Component({
  selector: 'app-following',
  imports: [],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _followingService: FollowingService = inject(FollowingService);
  following: IFollowingList | undefined;


  constructor() {
    this._followingService.getFollowing().subscribe((following) => {
      if(following) {
        this.following = following;
      }
      else {
        console.log("FAILED TO LOAD FRIENDS");
      }

    });
  }



}
