import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    login (email: string, password: string): boolean {
        // Aca iria el endpoint real de autenticacion
        if (email === 'esecaidavargas@gmail.com' && password === 'password123') {
            console.log('Login successful');
            return true;
        }
        else {
            console.log('Invalid credentials');
            return false;
        }
    }
}