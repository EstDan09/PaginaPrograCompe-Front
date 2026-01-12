import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../services/group.service';
import { IGroup } from '../../../../models/group.model';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-my-groups',
  imports: [TranslatePipe],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.scss',
})


export class MyGroups {
  private _groupService = inject(GroupService);
  groupList = this._groupService.groupList;

  constructor() {
    this._groupService.getMyGroups().subscribe((groups) => {
      if (!groups) {
        console.log("There are no groups or failed to load them");
      }
    })
  }

}


