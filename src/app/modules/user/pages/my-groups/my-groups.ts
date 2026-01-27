import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupService } from '../../../../services/group.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-my-groups',
  imports: [RouterLink],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.scss',
})
export class MyGroups {
  private _groupService = inject(GroupService);
  private _authService = inject(AuthService);
  private _roleSignal = signal<boolean | null>(false);



  groups = this._groupService.myGroupsSummary;

  isEmpty = computed(() => (this.groups()?.length ?? 0) === 0);

  constructor() {
    this._authService.fetchMe().subscribe((res) => {
      if (res?.role == 'coach') {
        this._roleSignal.set(true);
      }
    });
    this._groupService.getMyGroupsSummary().subscribe();
  }
}
