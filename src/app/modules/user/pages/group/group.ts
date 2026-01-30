import { signal, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../../../services/group.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdderDialog } from './adder-dialog/adder-dialog';
import { GroupMembersDialog } from './group-members-dialog/group-members-dialog';
import { AssignmentDialog } from './assignment-dialog/assignment-dialog';
import { DeletionDialog } from './deletion-dialog/deletion-dialog';
import { CodeDialog } from './code-dialog/code-dialog';
import { IGroupErr, IInvite } from '../../../../models/group.model';

@Component({
  selector: 'app-group',
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './group.html',
  styleUrl: './group.scss',
})
export class Group {
  private _authService = inject(AuthService);
  loaded = signal<boolean>(false);
  filled = signal<boolean>(false);
  clicked = signal<boolean>(false);
  route = inject(ActivatedRoute);
  groupService = inject(GroupService);
  groupDetails = this.groupService.groupDetails;
  me = this._authService.user;
  private dialog = inject(MatDialog);

  add = () => {
    this.dialog?.open(AdderDialog, {
      width: '30%',
      height: '20%',
      data: {
        groupId: this.route.snapshot.params['id'],
      }
    });
    console.log("CLICKED");
  }

  addAssign = () => {
    this.dialog?.open(AssignmentDialog, {
      width: '50%',
      height: '60%',
      data: {
        groupId: this.route.snapshot.params['id'],
      },
    })
  }

  openCode = (code: string) => {
    this.dialog?.open(CodeDialog, {
      width: '90%',
      height: '60%',
      data: {
        code: code,
      },
    })

  }

  createCode = () => {
    if (this.clicked()) {
      return;
    }
    this.clicked.set(true);

    this.groupService.postCreateCode(this.route.snapshot.params['id']).subscribe({

      next: (res) => {
        if (typeof (res as any)?.message === 'string') {
          const bruh = res as IGroupErr;
          this.openCode(bruh.message);

        } else {
          const bruh = res as IInvite;
          this.openCode(bruh.invite_code);
        }
        this.clicked.set(false);

      },
      error: () => {
      },

    });


  }



  delGroup = () => {
    this.dialog?.open(DeletionDialog, {
      width: '50%',
      height: '35%',
      data: {
        groupId: this.route.snapshot.params['id'],
      },
    })
  }

  isCoach = computed(() => {
    const me = this.me();
    const details = this.groupDetails();
    if (!me || !details) return false;

    return (
      me.username == details.group.owner.username &&
      me.role == 'coach'
    );

  });


  constructor() {

    const id = this.route.snapshot.params['id'];

    console.log('Group ID:', id);

    this.groupService.getGroupDetails(id).subscribe();
    this._authService.fetchMe().subscribe();
  }

  trackAssignment = (_: number, a: { _id: string }) => a._id;

  openMembers() {
    const groupId = this.route.snapshot.params['id'];
    this.dialog.open(GroupMembersDialog, {
      width: '560px',
      data: { groupId },
    });
  }

}
