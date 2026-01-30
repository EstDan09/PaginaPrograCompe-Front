export interface IFollow {
  _id: string;
  student_1_id: string;
  student_2_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFollowName {
  _id?: string;
  name: string;
  student_id: string;
}

export interface IFollowingResponse {
  following: IFollowName[];
}

export interface IFollowingList {
  following: IFollow[];
}