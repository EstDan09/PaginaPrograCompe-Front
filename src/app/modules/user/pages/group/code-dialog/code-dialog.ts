import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-code-dialog',
  imports: [],
  templateUrl: './code-dialog.html',
  styleUrl: './code-dialog.scss',
})
export class CodeDialog {
  data = inject(MAT_DIALOG_DATA) as {
    code: string,
  }


}
