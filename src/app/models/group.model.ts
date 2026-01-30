import { IUser, IUserMini } from "./user.model";
import { IAssignmentSummary } from "./assignment.model";

export interface IStudentGroupUsername {
  _id: string;
  student_id: string;
  student_username: string;
  group_id: string;
}


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

export interface IMyGroupSummary {
  groupId: string;
  name: string;
  ownerUsername: string;
  members: number;
  role: 'Student' | 'Coach' | 'Admin';
  dueAssignments: number;
}

export interface IGroupDetails {
  group: {
    _id: string;
    name: string;
    description?: string | null;
    owner: IUserMini;
  };
  assignments: IAssignmentSummary[];
}

export interface ICreatedGroup {
  _id: string,
  name: string,
  description: string,
  parent_coach: string,
  group_messages: [
    {
      sender_id: string,
      message: string,
      timestamp: Date,
    }
  ],
  invite_code: string,
}

export interface IGroupErr {
  message: string
}

export interface IAddition {
  _id: string,
  student_id: string,
  group_id: string,
}

export interface IInvite {
  invite_code: string,
}

export interface IGroupJoin {
  _id: string,
  student_id: string,
  group_id: string,
}


