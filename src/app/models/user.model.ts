export interface IUser {
  _id: string;
  username: string;
  email?: string;
  role: 'student' | 'coach' | 'admin';
}
