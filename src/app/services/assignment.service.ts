import { Injectable } from '@angular/core';
import { IAssignment, IExercise } from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  ecxercises: IExercise[] = [
    {
      title: "placeholder",
      points: 5,
      problem_id: "1054D",
    },
    {
      title: "placeholder",
      points: 5,
      problem_id: "1054D",
    },
    {
      title: "placeholder",
      points: 5,
      problem_id: "1054D",
    },
  ]
  assignments: IAssignment[] = [
    {
      _id: '0',
      description: 'placeholder',
      dueDate: new Date('2026-01-01'),
      exercises: this.ecxercises,
    },
  ]

  getAssignmentById(id: string) {
    return this.assignments.find(u => u._id === id);
  }
}
