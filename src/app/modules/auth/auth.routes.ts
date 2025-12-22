import { Routes } from "@angular/router";
import { Login } from "./pages/login/login";
import { CreateUser } from "./pages/create-user/create-user";
import { Welcome } from "./pages/welcome/welcome";

export const Auth_Routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'create-user',
        component: CreateUser
    },
    {
        path: 'welcome',
        component: Welcome
    }

];