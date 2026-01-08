import { Routes } from "@angular/router";
import { UserLayout } from "./pages/user-layout/user-layout";

export const User_Routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home').then(m => m.Home)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then(m => m.Profile)
      },
      {
        path: 'assignment/:id',
        loadComponent: () =>
          import('./pages/assignment/assignment').then(m => m.Assignment)
      },
      {
        path: 'my-groups/:id',
        loadComponent: () =>
          import('./pages/my-groups/my-groups').then(m => m.MyGroups)
      },
      {
        path: 'group/:id',
        loadComponent: () =>
          import('./pages/group/group').then(m => m.Group)
      },
      {
        path: '**',
        redirectTo: ''
      },
      {
        path: 'following',
        loadComponent: () =>
          import('./pages/following/following').then(m => m.Following)
      }
    ]
  }
];
