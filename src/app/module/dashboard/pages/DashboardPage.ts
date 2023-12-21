import { Component }       from '@angular/core';
import { LocationService } from '../../location/service/LocationService';
import { MarkerService }   from '../../location/service/MarkerService';
import { Marker }          from '../../location/domain/Marker';
import { Address }         from 'ngx-google-places-autocomplete/objects/address';
import { Location }        from '../../location/domain/Location';


@Component({
    selector: DashboardPage.selector,
    styleUrls: ['../style/dashboard.scss'],
    templateUrl: '../template/dashboard.html',
})
export class DashboardPage {

    static readonly selector: string = 'dashboard-page';
    sizeOptions = [{value: 1, name: '1 - 5'}, {value: 6, name: '6 - 10'}, {value: 11, name: '11 - 20'}, {value: 20, name: '20 +'}];
    public isLoading: boolean = false;

    public marker: Marker;

    constructor(
        private locationService: LocationService,
        private markerService: MarkerService
    ) {
    }

    ngOnInit() {
        this.locationService.getFormEventEmitter().emit(null);
        this.initSubscription();
    }

    getSizeOptionByValue(value: number): string {
        return this.sizeOptions.find((option) => option.value === value).name;
    }

    buildDirectionsLink(marker: Marker): string {
        return `https://www.google.com/maps/dir/?api=1&destination=${ marker.position.lat() }%2C${ marker.position.lng() }`;
    }

    getTimeStringFormat(date: Date): string {
        if (!date.getMinutes()) {
            return 'ha';
        }
        return 'hmma';
    }


    public onAddressChange(address: Address) {
        const location: Location = new Location();
        location.name = address.name;
        location.latitude = address.geometry.location.lat();
        location.longitude = address.geometry.location.lng();
        this.locationService.getSearchEventEmitter().emit(location);
    }

    private initSubscription(): void {
        this.markerService.getMapEventEmitter().subscribe(event => {
            this.marker = event;
        });
    }

}
