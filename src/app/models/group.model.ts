import { IUser } from "./user.model";
import { IAssignment } from "./assignment.model";

export interface IGroup {
  _id: string;
  createdAt: string;
  group_id: string;
  student_id: string;
  updatedAt: string;
}

export interface IGroupData {
  _id: string;
  description: string;
  name: string;
  parent_coach: string;
}

