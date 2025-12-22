import { IGroup } from "./group.model";

export interface IUser {
    _id?: string;
    username: string;
    email: string;
    role?: string;
    child_groups?: IGroup[];
}
