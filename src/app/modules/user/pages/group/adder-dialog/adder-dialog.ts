
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

  addForm = this._formBuilder.group({
    studentName: ['', [Validators.required]],
  });

  onSubmit = () => {

    if (this.addForm.invalid) return;

    const studentName = this.addForm.value;

  }

  onClose = () => {
    this._dialogRef.close();
  }

}
