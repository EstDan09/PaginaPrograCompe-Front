import { IUser } from "./user.model";
import { IAssignment } from "./assignment.model";

export interface IGroup {
  _id: string;
  name: string;
  creator_id: string;
  members: IUser[];
  assignments: IAssignment[];
}
