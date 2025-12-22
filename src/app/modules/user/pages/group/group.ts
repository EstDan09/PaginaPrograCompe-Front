import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGroup } from '../../../../models/group.model';
import { GroupService } from '../../../../services/group.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-group',
  imports: [TranslatePipe],
  templateUrl: './group.html',
  styleUrl: './group.scss',
})
export class Group {
  route = inject(ActivatedRoute);
  groupService = inject(GroupService);

  group!: IGroup | undefined;

  constructor() {
    const groupId = this.route.snapshot.params['id'];
    this.group = this.groupService.getGroupById(groupId);
  }


}
