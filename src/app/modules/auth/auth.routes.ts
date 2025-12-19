import { Routes } from "@angular/router";
import { Login } from "./pages/login/login";
import { CreateUser } from "./pages/create-user/create-user";

export const Auth_Routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'create-user',
        component: CreateUser
    }

];