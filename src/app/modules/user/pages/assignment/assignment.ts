import { Component, inject } from '@angular/core';
import { IAssignment, IExcerice } from '../../../../models/assignment.model';
import { AssignmentService } from '../../../../services/assignment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment',
  imports: [],
  templateUrl: './assignment.html',
  styleUrl: './assignment.scss',
})
export class Assignment {
  route: ActivatedRoute = inject(ActivatedRoute);
  assignmentService: AssignmentService = inject(AssignmentService);
  assignment!: IAssignment | undefined;


  constructor() {
    const assignmentId: string = this.route.snapshot.params['id'];
    this.assignment = this.assignmentService.getAssignmentById(assignmentId);
  }


}
