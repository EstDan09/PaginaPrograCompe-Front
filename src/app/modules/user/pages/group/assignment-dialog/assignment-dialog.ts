
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../../../services/group.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { AssignmentService } from '../../../../../services/assignment.service';


@Component({
  selector: 'app-assignment-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './assignment-dialog.html',
  styleUrl: './assignment-dialog.scss',
})

export class AssignmentDialog {
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<AssignmentDialog>);
  private _groupService = inject(GroupService);
  private _assignmentService = inject(AssignmentService);
  filled = signal<boolean>(false);
  clicked = signal<boolean>(false);
  failed = signal<boolean>(false);
  success = signal<boolean>(false);
  next = signal<boolean>(false);
  problems = signal<string[]>([]);
  assignmentName = signal<string>("");
  dueDate = signal<Date | null>(null);
  desc = signal<string>("");



  data = inject(MAT_DIALOG_DATA) as {
    groupId: string,
  }

  addForm = this._formBuilder.nonNullable.group({
    assignmentName: ['', Validators.required],
    desc: [''],
    dueDate: [null as Date | null, Validators.required],
  });

  problem = this._formBuilder.nonNullable.group({
    prob: ['', Validators.required],
  });

  onNext = () => {
    if (this.addForm.invalid) return;
    const { assignmentName, dueDate, desc } = this.addForm.getRawValue();
    this.next.set(true);
    this.dueDate.set(dueDate);
    this.assignmentName.set(assignmentName);
    this.desc.set(desc);
  }

  addProblem = () => {

    if (this.problem.invalid) return;

    const { prob } = this.problem.getRawValue();

    this.problems.set([prob, ...this.problems()]);

    this.problem.reset();

  }

  onSubmit = () => {
    if (this.problems().length == 0 || this.clicked()) return;
    this.clicked.set(true);

    this._assignmentService.postCreateAssignment(
      this.assignmentName(),
      this.desc(),
      this.problems(),
      this.data.groupId,
      this.dueDate(),
    ).subscribe({

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
