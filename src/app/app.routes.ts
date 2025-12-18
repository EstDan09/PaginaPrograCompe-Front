import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'user',
        loadChildren:() =>
            import('./modules/user/user.routes').then(m => m.User_Routes)
    }
];