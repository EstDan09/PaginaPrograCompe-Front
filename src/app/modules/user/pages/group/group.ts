import { signal, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../../../services/group.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdderDialog } from './adder-dialog/adder-dialog';

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
  route = inject(ActivatedRoute);
  groupService = inject(GroupService);
  groupDetails = this.groupService.groupDetails;
  me = this._authService.user;
  private dialog = inject(MatDialog);

  add = () => {
    this.dialog?.open(AdderDialog, {
      width: '30%',
      height: '20%',
    });
    console.log("CLICKED");
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




}
