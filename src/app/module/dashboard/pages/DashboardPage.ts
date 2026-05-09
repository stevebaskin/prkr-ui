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
    sizeOptions = [{value: 1, name: '1 - 5'}, {value: 6, name: '6 - 10'}, {value: 11, name: '11 - 20'}, {value: 20, name: '20+'}];
    reportIssueOptions = [
        {value: 'NO_LONGER_EXISTS', name: 'Parking no longer exists'},
        {value: 'DETAILS_WRONG', name: 'Details are wrong'},
        {value: 'OTHER', name: 'Other'}
    ];
    reportDetailsMaxLength = 200;
    public isLoading: boolean = false;

    public marker: Marker;
    public isReportFormOpen: boolean = false;
    public isReportSubmitting: boolean = false;
    public reportIssueType: string = '';
    public reportDetails: string = '';
    public reportSuccessMessage: string = null;
    public reportErrorMessage: string = null;

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

    openDirections(marker: Marker): void {
        const directionsUrl = this.buildDirectionsLink(marker);
        window.open(directionsUrl, '_blank');
    }

    canReportMarker(marker: Marker): boolean {
        return !!(marker && marker.id);
    }

    openReportForm(): void {
        this.isReportFormOpen = true;
        this.reportSuccessMessage = null;
        this.reportErrorMessage = null;
    }

    cancelReport(): void {
        this.resetReportForm();
    }

    submitReport(): void {
        this.reportSuccessMessage = null;
        this.reportErrorMessage = null;

        const details = (this.reportDetails || '').trim();
        if (!this.canReportMarker(this.marker)) {
            this.reportErrorMessage = 'Select a saved parking spot before reporting.';
            return;
        }

        if (!this.reportIssueType) {
            this.reportErrorMessage = 'Select the issue you want to report.';
            return;
        }

        if (this.isReportDetailsRequired() && !details) {
            this.reportErrorMessage = 'Tell us what needs to change at this spot.';
            return;
        }

        if (details.length > this.reportDetailsMaxLength) {
            this.reportErrorMessage = `Keep the report to ${ this.reportDetailsMaxLength } characters.`;
            return;
        }

        this.isReportSubmitting = true;
        this.locationService.reportInconsistency(this.marker.id, {
            issueType: this.reportIssueType,
            details
        }).subscribe({
            next: () => {
                this.isReportSubmitting = false;
                this.isReportFormOpen = false;
                this.reportDetails = '';
                this.reportIssueType = '';
                this.reportSuccessMessage = 'Thanks, the report has been sent.';
            },
            error: () => {
                this.isReportSubmitting = false;
                this.reportErrorMessage = 'The report could not be sent. Please try again.';
            }
        });
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

    public getPlacesAutoCompleteOptions(): any {
        return {
            componentRestrictions: {country: 'au'}
        };
    }

    public isReportDetailsRequired(): boolean {
        return this.reportIssueType !== 'NO_LONGER_EXISTS';
    }

    private initSubscription(): void {
        this.markerService.getMapEventEmitter().subscribe(event => {
            this.marker = event;
            this.resetReportForm();
        });
    }

    private resetReportForm(): void {
        this.isReportFormOpen = false;
        this.isReportSubmitting = false;
        this.reportIssueType = '';
        this.reportDetails = '';
        this.reportSuccessMessage = null;
        this.reportErrorMessage = null;
    }

}
