import { Injectable } from '@angular/core';
import { IGroup } from '../models/group.model';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  students: IUser[] = [
    {
      _id: "0",
      username: "moraga",
      email: "test@mail.com",
      role: "student",
      child_groups: []

    },
    {
      _id: "0",
      username: "moraga",
      email: "test@mail.com",
      role: "student",
      child_groups: []

    },
    {
      _id: "0",
      username: "moraga",
      email: "test@mail.com",
      role: "student",
      child_groups: []

    },
  ]

  groups: IGroup[] = [
    {
      _id: "0",
      name: "bruh",
      creator_id: "0",
      members: this.students,
      assignments: []
    }
  ]
  getMyGroups(id: string) {
    return this.groups.find((g) => g._id === id)
  }

}


