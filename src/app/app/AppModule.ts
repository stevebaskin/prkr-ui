// TODO Understand what this does!
import 'reflect-metadata';

import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { Module as CoreModule }     from '../module/core/Module';
import { Module as LocationModule } from '../module/location/Module';
import { AppRouter }                from './AppRouter';
import { AppComponent }             from './AppComponent';
import { AppInfoComponent }         from './component/AppInfoComponent';
import { AppMapComponent }          from './component/AppMapComponent';
import { GoogleMapsModule }         from '@angular/google-maps';
import { LocationService }          from '../module/location/service/LocationService';
import { MarkerService }            from '../module/location/service/MarkerService';

@NgModule({
    declarations: [
        AppComponent,
        AppInfoComponent,
        AppMapComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        AppRouter,
        GoogleMapsModule,
        LocationModule
    ],
    providers: [LocationService, MarkerService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
