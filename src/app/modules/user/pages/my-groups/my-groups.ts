import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupService } from '../../../../services/group.service';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatorDialog } from './creator-dialog/creator-dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResDialog } from './res-dialog/res-dialog';
import { IGroupErr, IGroupJoin } from '../../../../models/group.model';

@Component({
  selector: 'app-my-groups',
  imports: [RouterLink, MatDialogModule, ReactiveFormsModule],
  templateUrl: './my-groups.html',
  styleUrl: './my-groups.scss',
})
export class MyGroups {
  private _groupService = inject(GroupService);
  private _authService = inject(AuthService);
  roleSignal = signal<boolean | null>(false);
  private dialog = inject(MatDialog);
  private _formBuilder = inject(FormBuilder)
  clicked = signal<boolean>(false);
  failed = signal<boolean>(false);

  groupCode = this._formBuilder.nonNullable.group({
    code: ['', Validators.required],
  });


  groups = this._groupService.myGroupsSummary;

  create = () => {
    this.dialog?.open(CreatorDialog, {
      width: '30%',
      height: '20%',
    });
    console.log("CLICKED");
  }

  joinRes = (res: string) => {
    this.dialog?.open(ResDialog, {
      width: '30%',
      height: '20%',
      data: {
        res: res,
      }
    });

  }

  joinGroup = () => {
    if (this.groupCode.invalid || this.clicked()) return;
    this.clicked.set(true);
    const { code } = this.groupCode.getRawValue();
    console.log(code);
    this._groupService.postJoinGroupCode(code).subscribe({

      next: (res) => {
        if (typeof (res as any)?.message === 'string') {
          const bruh = res as IGroupErr;
          this.joinRes(bruh.message);
        } else {
          this.joinRes("Joined successfully");
          this.groupCode.reset();
        }

        this.clicked.set(false);
      },
      error: (res) => {
        const bruh = res as IGroupErr;
        this.failed.set(true);
        this.clicked.set(false);
        this.clicked.set(false);
        this.joinRes(bruh.message);
      },


    });

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
