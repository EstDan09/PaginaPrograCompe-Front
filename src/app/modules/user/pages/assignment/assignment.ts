import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IAssignment } from '../../../../models/assignment.model';
import { AssignmentService } from '../../../../services/assignment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './assignment.html',
  styleUrl: './assignment.scss',
})
export class Assignment {
  private route = inject(ActivatedRoute);
  private assignmentService = inject(AssignmentService);

  assignment: IAssignment | undefined;

  constructor() {
    const assignmentId: string = this.route.snapshot.params['id'];
    this.assignment = this.assignmentService.getAssignmentById(assignmentId);
  }
}
