import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { DashboardPage }     from './pages/DashboardPage';
import { Router }            from './Router';
import { FormsModule }       from '@angular/forms';
import { GooglePlacesAutocompleteDirective } from './directive/GooglePlacesAutocompleteDirective';


@NgModule({
    declarations: [
        DashboardPage,
        GooglePlacesAutocompleteDirective
    ],
    imports: [
        CommonModule,
        Router,
        FormsModule,
    ],

})
export class Module {
}
