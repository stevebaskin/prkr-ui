import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage }        from './pages/DashboardPage';

const routes: Routes = [
    {
        path: '',
        component: DashboardPage,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)],
})
export class Router {
}
