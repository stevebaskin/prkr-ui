import { Component }       from '@angular/core';
import { LocationService } from '../../location/service/LocationService';

@Component({
    selector: DashboardPage.selector,
    styleUrls: ['../style/dashboard.scss'],
    templateUrl: '../template/dashboard.html',
})
export class DashboardPage {

    static readonly selector: string = 'dashboard-page';

    constructor(
        private locationService: LocationService,
    ) {
    }

    ngOnInit() {
        this.locationService.getEventEmitter().emit(null);
    }

}
