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
    sizeOptions = [{value: 1, name: '1 - 5'}, {value: 6, name: '6 - 10'}, {value: 11, name: '11 - 20'}, {value: 20, name: '20 +'}];

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
        // Sydney
        this.location.latitude = -33.88270036534784;
        this.location.longitude = 151.20659726260985;

        this.locationService.getFormEventEmitter().emit(this.location);
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.location.latitude = position.coords.latitude;
            this.location.longitude = position.coords.longitude;

            this.locationService.getFormEventEmitter().emit(this.location);
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
