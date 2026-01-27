import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-assignment',
  imports: [TranslatePipe],
  templateUrl: './assignment.html',
  styleUrl: './assignment.scss',
})
export class Assignment {
  private route = inject(ActivatedRoute);
  private assignmentService = inject(AssignmentService);

  assignment = this.assignmentService.assignment;   
  exercises = this.assignmentService.exercises;
      
  constructor() {
    const id = this.route.snapshot.params['id'];
    this.assignmentService.loadAssignmentScreen(id).subscribe();
  }

  verify() {
    console.log('verify clicked');
  }
}
