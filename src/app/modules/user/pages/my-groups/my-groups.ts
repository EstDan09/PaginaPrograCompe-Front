import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupService } from '../../../../services/group.service';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatorDialog } from './creator-dialog/creator-dialog';

@Component({
  selector: 'app-my-groups',
  imports: [RouterLink, MatDialogModule],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.scss',
})
export class MyGroups {
  private _groupService = inject(GroupService);
  private _authService = inject(AuthService);
  roleSignal = signal<boolean | null>(false);
  private dialog = inject(MatDialog);



  groups = this._groupService.myGroupsSummary;

  create = () => {
    this.dialog?.open(CreatorDialog, {
      width: '30%',
      height: '20%',
    });
    console.log("CLICKED");
  }

  isEmpty = computed(() => (this.groups()?.length ?? 0) === 0);

  constructor() {
    this._authService.fetchMe().subscribe((res) => {
      if (res?.role == 'coach') {
        this.roleSignal.set(true);
      }
    });
    this._groupService.getMyGroupsSummary().subscribe();
    console.log(this.groups());
  }
}
