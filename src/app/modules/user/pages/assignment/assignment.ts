import { Component, inject, signal } from '@angular/core';
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
  solved = signal<boolean>(false);

  assignment = this.assignmentService.assignment;
  exercises = this.assignmentService.exercises;

  constructor() {
    const id = this.route.snapshot.params['id'];
    this.assignmentService.loadAssignmentScreen(id).subscribe();
    this.assignmentService.getCheckAssignment(id).subscribe({
      next: (res) => {
        if (res) this.solved.set(true);
      },
      error: () => {
      }

    })

  }

  createLink(index: number) {
    const pid = this.exercises()[index].problem_id;
    let contest = ""
    let prob = ""
    let len = pid.length;
    let i = 0;

    for (const char of pid) {
      if (/[0-9]/.test(char)) {
        i++;
        contest += char;
      } else {
        break;
      }
    }
    while (i < len) {
      prob += pid[i];
      i++;
    }

    return `https://codeforces.com/contest/${contest}/problem/${prob}`

  }

  verify() {
    console.log('verify clicked');
  }
}
