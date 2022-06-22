import { Component }       from '@angular/core';
import { LocationService } from '../../location/service/LocationService';
import { MarkerService }   from '../../location/service/MarkerService';
import { Marker }          from '../../location/domain/Marker';

@Component({
    selector: DashboardPage.selector,
    styleUrls: ['../style/dashboard.scss'],
    templateUrl: '../template/dashboard.html',
})
export class DashboardPage {

    static readonly selector: string = 'dashboard-page';

    public marker: Marker;

    constructor(
        private locationService: LocationService,
        private markerService: MarkerService
    ) {
    }

    ngOnInit() {
        this.locationService.getFormEventEmitter().emit(null);
        this.initSubscription()
    }

    private initSubscription(): void {
        this.markerService.getMapEventEmitter().subscribe(event => {
            this.marker = event;
        });
    }

}
