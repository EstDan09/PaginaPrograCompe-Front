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
        path: 'my-groups',
        loadComponent: () =>
          import('./pages/my-groups/my-groups').then(m => m.MyGroups)
      },
      {
        path: 'group/:id',
        loadComponent: () =>
          import('./pages/group/group').then(m => m.Group)
      },

      {
        path: 'following',
        loadComponent: () =>
          import('./pages/following/following').then(m => m.Following)
      },

      {
        path: 'challenges',
        loadComponent: () =>
          import('./pages/challenges/challenges').then(m => m.Challenges)
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./pages/stats/stats').then(m => m.Stats)
      },
      {
        path: 'verification',
        loadComponent: () =>
          import('./pages/verification/verification').then(m => m.Verification)
      },
      {
        path: '**',
        redirectTo: ''
      },

    ]
  }
];
