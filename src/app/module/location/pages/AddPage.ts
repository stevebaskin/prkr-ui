import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location }                             from '../domain/Location';
import { LocationService }                      from '../service/LocationService';
import { Router }                               from '@angular/router';


@Component({
    selector: AddPage.selector,
    styleUrls: ['../style/add.scss'],
    templateUrl: '../template/add.html',
})
export class AddPage implements OnInit {

    static readonly selector: string = 'location-add-page';

    public location: Location = new Location();
    public address: string;
    sizeOptions = [{value: 1, name: '1 - 5'}, {value: 6, name: '6 - 10'}, {value: 11, name: '11 - 20'}, {value: 20, name: '20 +'}];

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private locationService: LocationService,
    ) {
    }

    ngOnInit() {
        this.initSubscription();
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
        navigator.geolocation.getCurrentPosition(async (position) => {
            this.location.latitude = position.coords.latitude;
            this.location.longitude = position.coords.longitude;
            this.address = await this.getAddress(this.location);

            this.locationService.getFormEventEmitter().emit(this.location);
        });
    }

    async getAddress(location: Location): Promise<string> {
        const position = new google.maps.LatLng(location.latitude, location.longitude);
        const geocoder = new google.maps.Geocoder();

        const geocodeResponse = await geocoder.geocode({'location': position});
        return geocodeResponse.results[0].formatted_address;
    }

    onSubmit() {
        if (!this.location.restrictedHours) {
            this.location.startTime = null;
            this.location.endTime = null;
        }
        this.location.name = this.address;
        this.locationService.save(this.location).subscribe(() => {
            this.router.navigate(['/']);
        });
    }

    onCancel() {
        this.locationService.getSearchEventEmitter().emit(null);
        this.router.navigate(['/']);
    }

    private initSubscription(): void {
        this.locationService.getMapEventEmitter().subscribe(async event => {
            this.location.latitude = event.latitude;
            this.location.longitude = event.longitude;
            this.address = await this.getAddress(event);

            this.cdRef.detectChanges();
        });
    }

}
