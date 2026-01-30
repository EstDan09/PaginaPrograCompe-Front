import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../../../services/group.service';
import { IGroupErr } from '../../../../../models/group.model';



@Component({
  selector: 'app-res-dialog',
  imports: [],
  templateUrl: './res-dialog.html',
  styleUrl: './res-dialog.scss',
})
export class ResDialog {
  private _groupService = inject(GroupService);
  private _router = inject(Router);
  filled = signal<boolean>(false);
  clicked = signal<boolean>(false);
  failed = signal<boolean>(false);
  success = signal<boolean>(false);
  errMsg = signal<string>("");

  data = inject(MAT_DIALOG_DATA) as {
    res: string,
  }




}
