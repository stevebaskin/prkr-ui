import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {path: '', loadChildren: () => import('../module/dashboard/Module').then(m => m.Module)},
            {path: 'locations', loadChildren: () => import('../module/location/Module').then(m => m.Module)},
        ]
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRouter {
}
