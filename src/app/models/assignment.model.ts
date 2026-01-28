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

export interface IAssignmentData {
  _id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  parent_group: string;
}

export interface IExerciseData {
  _id: string;
  name: string;
  cf_code: string;
  parent_assignment: string;
}

export interface ICreateAssign {
  _id: string;
  title: string;
  description: string;
  dueDate: Date,
  parent_group: string
}

export interface IProblem {
  name: string;
  cf_code: string;
}


