import { NgModule }        from '@angular/core';
import { CommonModule }    from '@angular/common';
import { DashboardPage }   from './pages/DashboardPage';
import { Router }            from './Router';


@NgModule({
    declarations: [
        DashboardPage
    ],
    imports: [
        CommonModule,
        Router,
    ],

})
export class Module {
}
