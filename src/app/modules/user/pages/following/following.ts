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
  following: IFollowingList | undefined;
  followingService: FollowingService = inject(FollowingService);


  constructor() {
    // this.followingService
    //   .getFollowing()
    //   .then((follwingList : IFollowingList) => {
    //     this.following = follwingList;
    //     this.changeDetectorRef.markForCheck();
    //   })


  }



}
