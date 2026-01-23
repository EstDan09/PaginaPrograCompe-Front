export interface IExercise {
  title: string;
  points: Number;
  problem_id: string;
}

export interface IAssignment {
  _id: string;
  description: string;
  dueDate: Date;
  exercises: IExercise[];
}

export interface IAssignmentSummary {
  _id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;    
  exerciseCount: number;
}
