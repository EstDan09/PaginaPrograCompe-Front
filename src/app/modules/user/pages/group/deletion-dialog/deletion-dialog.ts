import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../../../services/group.service';
import { IGroupErr } from '../../../../../models/group.model';

@Component({
  selector: 'app-deletion-dialog',
  imports: [],
  templateUrl: './deletion-dialog.html',
  styleUrl: './deletion-dialog.scss',
})
export class DeletionDialog {
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<DeletionDialog>);
  private _groupService = inject(GroupService);
  private _router = inject(Router);
  filled = signal<boolean>(false);
  clicked = signal<boolean>(false);
  failed = signal<boolean>(false);
  success = signal<boolean>(false);
  errMsg = signal<string>("");

  data = inject(MAT_DIALOG_DATA) as {
    groupId: string,
  }


  onSubmit = () => {


    this.clicked.set(true);



    this._groupService.deleteGroup(this.data.groupId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message != 'Group deleted successfully') {
          this.failed.set(true);
          this.clicked.set(false);
        } else {
          this.success.set(true);
          console.log("HELL YEAH");

          setTimeout(() => {

            this._dialogRef.close();
            this._router.navigate(['/user/my-groups']);
          }, 1000);
        }
      },
      error: (res) => {
        this.errMsg.set(res.message);
        this.failed.set(true);
        this.clicked.set(false);
      },
    });


  }


}
