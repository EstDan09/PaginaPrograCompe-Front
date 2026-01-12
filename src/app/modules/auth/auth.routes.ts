import { Routes } from "@angular/router";
import { Login } from "./pages/login/login";
import { CreateUser } from "./pages/create-user/create-user";
import { Welcome } from "./pages/welcome/welcome";
import { Verification } from "./pages/verification/verification";

export const Auth_Routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'create-user',
        component: CreateUser
    },
    {
        path: 'welcome',
        component: Welcome
    },
    {
        path: 'verification',
        component: Verification
    }
];