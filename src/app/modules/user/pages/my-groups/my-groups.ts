import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../services/group.service';
import { IGroup } from '../../../../models/group.model';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-my-groups',
  imports: [TranslatePipe],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.scss',
})
export class MyGroups {
  route = inject(ActivatedRoute);
  groupService = inject(GroupService);
  groupList!: IGroup[] | undefined;

  constructor() {
    const userId: string = this.route.snapshot.params['id'];
    this.groupList = this.groupService.getMyGroups(userId);
  }
}


