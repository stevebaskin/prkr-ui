import { Component, OnInit } from '@angular/core';
import { Location }          from '../domain/Location';
import { LocationService }   from '../service/LocationService';
import { Router }            from '@angular/router';


@Component({
    selector: AddPage.selector,
    styleUrls: ['../style/add.scss'],
    templateUrl: '../template/add.html',
})
export class AddPage implements OnInit {

    static readonly selector: string = 'location-add-page';

    public location: Location = new Location();

    constructor(
        private router: Router,
        private locationService: LocationService,
    ) {
    }

    ngOnInit() {
        this.initLocation();
        this.getCurrentLocation();
    }

    initLocation() {
        this.location.latitude = 0;
        this.location.longitude = 0;

        this.locationService.getEventEmitter().emit(this.location);
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.location.latitude = position.coords.latitude;
            this.location.longitude = position.coords.longitude;

            this.locationService.getEventEmitter().emit(this.location);
        });
    }

    onChange() {
        this.locationService.getEventEmitter().emit(this.location);
    }

    onSubmit() {
        this.locationService.save(this.location).subscribe(() => {
            this.router.navigate(['/']);
        });
    }

}
