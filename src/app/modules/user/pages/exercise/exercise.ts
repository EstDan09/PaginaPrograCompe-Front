import { Component, input } from '@angular/core';
import { IExercise } from '../../../../models/assignment.model';

@Component({
  selector: 'app-exercise',
  imports: [],
  templateUrl: './exercise.html',
  styleUrl: './exercise.scss',
})
export class Exercise {
  exercise = input.required<IExercise>();



}
