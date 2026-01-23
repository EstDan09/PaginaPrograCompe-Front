import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupService } from '../../../../services/group.service';

@Component({
  selector: 'app-my-groups',
  imports: [RouterLink],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.scss',
})
export class MyGroups {
  private _groupService = inject(GroupService);

  groups = this._groupService.myGroupsSummary;

  isEmpty = computed(() => (this.groups()?.length ?? 0) === 0);

  constructor() {
    this._groupService.getMyGroupsSummaryDemo().subscribe();
  }
}
