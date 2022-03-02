import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPage }              from './pages/AddPage';

const routes: Routes = [
    {
        path: 'add',
        component: AddPage,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)],
})
export class Router {
}
