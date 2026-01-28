import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../../../services/group.service';

type DialogData = { groupId: string };

@Component({
  selector: 'app-group-members-dialog',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './group-members-dialog.html',
  styleUrl: './group-members-dialog.scss',
})
export class GroupMembersDialog {
  private _groupService = inject(GroupService);
  private _ref = inject(MatDialogRef<GroupMembersDialog>);

  loading = signal(true);

  // ✅ ahora sí: string[]
  members = this._groupService.groupMemberUsernames;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this._groupService.getGroupMembers(data.groupId).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  close() {
    this._ref.close();
  }

  trackName = (_: number, name: string) => name;
}
