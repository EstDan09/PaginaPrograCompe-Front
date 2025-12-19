export interface IExcerice {
    title: string;
    points: Number;
    problem_id: string;
}

export interface IAssignment {
    _id: string;
    description: string;
    dueDate: Date;
    exercises: IExcerice[];
}