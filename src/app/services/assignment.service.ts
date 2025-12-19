import { Injectable } from '@angular/core';
import { IAssignment, IExcerice } from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  assignments: IAssignment[] = [
    {
      _id: '0',
      description: 'placeholder',
      dueDate: new Date('2026-01-01'),
      exercises: [],
    },
  ]

  getAssignmentById(id: string) {
    return this.assignments.find(u => u._id === id);
  }
}
