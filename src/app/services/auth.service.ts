import { Injectable, signal, computed } from "@angular/core";
import { IUser } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<IUser | null>(null);

  user = this._user.asReadonly();

  isLoggedIn = computed(() => this._user() !== null);

  userId = computed(() => this._user()?._id ?? 'none');
  username = computed(() => this._user()?.username ?? 'Guest');
  email = computed(() => this._user()?.email ?? '—');
  role = computed(() => this._user()?.role ?? '—');
  groups = computed(() => this._user()?.child_groups ?? []);

  login(email: string, password: string): boolean {
    if (email === 'esecaidavargas@gmail.com' && password === 'password123') {
      this._user.set({
        _id: 'mock123',
        username: 'Esteban',
        email,
        role: 'student',
        child_groups: [],
      });
      return true;
    }
    return false;
  }

  logout() {
    this._user.set(null);
  }
}
