import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { DashboardPage }     from './pages/DashboardPage';
import { Router }            from './Router';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FormsModule }       from '@angular/forms';


@NgModule({
    declarations: [
        DashboardPage
    ],
    imports: [
        CommonModule,
        Router,
        FormsModule,
        GooglePlaceModule,
    ],

})
export class Module {
}
