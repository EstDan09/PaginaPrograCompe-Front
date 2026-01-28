import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../../../services/group.service';

@Component({
  selector: 'app-creator-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './creator-dialog.html',
  styleUrl: './creator-dialog.scss',
})
export class CreatorDialog {
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<CreatorDialog>);
  private _groupService = inject(GroupService);
  filled = signal<boolean>(false);
  clicked = signal<boolean>(false);
  failed = signal<boolean>(false);
  success = signal<boolean>(false);

  groupForm = this._formBuilder.group({
    groupName: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  onSubmit = () => {

    if (this.groupForm.invalid || this.clicked()) return;
    this.clicked.set(true);

    const { groupName, description } = this.groupForm.value;

    this._groupService.postCreateGroup(groupName!, description!).subscribe({
      next: (res) => {
        if (typeof (res as any)?.message === 'string') {
          this.failed.set(true);
          this.clicked.set(false);
        } else {
          this.success.set(true);
        }
      },
      error: () => {
        this.failed.set(true);
        this.clicked.set(false);
      },
    });
  }

  onClose = () => {
    this._dialogRef.close();
  }

}
