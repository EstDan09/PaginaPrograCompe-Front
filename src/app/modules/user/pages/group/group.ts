import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  group = this.groupService.group;

  constructor() {
    this.groupService.getGroupById(this.route.snapshot.params['id']).subscribe((groups) => {
      if (!groups) {
        console.log("There are no groups");
      }
      else {
        console.log(groups);
      }
    })

  }


}
