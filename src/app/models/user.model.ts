export interface IUser {
  _id: string;
  username: string;
  email?: string;
  role: 'student' | 'coach' | 'admin';
}

export interface IUserMini {
  _id: string;
  username: string;
  role: 'admin' | 'coach' | 'student';
}


