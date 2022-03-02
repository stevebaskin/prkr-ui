import { NgModule }        from '@angular/core';
import { LocationService } from './service/LocationService';
import { CommonModule }    from '@angular/common';
import { AddPage }         from './pages/AddPage';
import { Router }          from './Router';
import { FormsModule }     from '@angular/forms';

@NgModule({
    declarations: [
        AddPage
    ],
    imports: [
        CommonModule,
        Router,
        FormsModule
    ],
    providers: [

    ],
})
export class Module {
}
