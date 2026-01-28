
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../../../services/group.service';

@Component({
  selector: 'app-creator-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './adder-dialog.html',
  styleUrl: './adder-dialog.scss',
})

export class AdderDialog {
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<AdderDialog>);
  private _groupService = inject(GroupService);
  filled = signal<boolean>(false);
  clicked = signal<boolean>(false);
  failed = signal<boolean>(false);
  success = signal<boolean>(false);

  data = inject(MAT_DIALOG_DATA) as {
    groupId: string,
  }

  addForm = this._formBuilder.nonNullable.group({
    studentName: ['', Validators.required],
  });

  onSubmit = () => {


    if (this.addForm.invalid || this.clicked()) return;
    this.clicked.set(true);


    const { studentName } = this.addForm.getRawValue();

    this._groupService.postGroupAddMember(this.data.groupId, studentName).subscribe({
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
