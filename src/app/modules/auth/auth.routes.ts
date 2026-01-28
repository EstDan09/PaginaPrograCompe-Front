import { Routes } from "@angular/router";
import { Login } from "./pages/login/login";
import { CreateUser } from "./pages/create-user/create-user";
import { Welcome } from "./pages/welcome/welcome";
import { AboutUs } from "./pages/about-us/about-us";
import { Faq } from "./pages/faq/faq";

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
        path: 'about',
        component: AboutUs
    },
    {
        path: 'faq',
        component: Faq
    }
];