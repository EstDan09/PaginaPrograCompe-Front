import { Injectable } from '@angular/core';
import { IGroup } from '../models/group.model';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

//All this data will go once the service can serve from API
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
      name: "Analisis de datos",
      creator_id: "0",
      members: this.students,
      assignments: []
    },
    {
      _id: "1",
      name: "Todo es mental",
      creator_id: "0",
      members: this.students,
      assignments: []
    },
    {
      _id: "2",
      name: "tec-alajuela",
      creator_id: "0",
      members: this.students,
      assignments: []
    }
  ]

  getGroupById(id: string) {
    return this.groups.find((g) => g._id === id);
  }

  getMyGroups(id: string) {
    return this.groups.filter((g) => g._id === id)
  }

}


