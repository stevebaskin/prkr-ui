import { EventEmitter }    from '@angular/core';
import { of, throwError }  from 'rxjs';
import { DashboardPage }   from './DashboardPage';
import { Location }        from '../../location/domain/Location';
import { Marker }          from '../../location/domain/Marker';

describe('DashboardPage', () => {
    let locationService: any;
    let markerEmitter: EventEmitter<Marker>;
    let page: DashboardPage;

    beforeEach(() => {
        markerEmitter = new EventEmitter<Marker>();
        locationService = {
            getFormEventEmitter: () => new EventEmitter<Location>(),
            getSearchEventEmitter: () => new EventEmitter<Location>(),
            reportInconsistency: jasmine.createSpy('reportInconsistency').and.returnValue(of(null))
        };

        page = new DashboardPage(locationService, {
            getMapEventEmitter: () => markerEmitter
        } as any);
    });

    it('does not allow reports for unsaved markers', () => {
        expect(page.canReportMarker({id: null} as Marker)).toBeFalse();
    });

    it('submits a valid report for the selected marker', () => {
        page.marker = {id: 7} as Marker;
        page.reportIssueType = 'DETAILS_WRONG';
        page.reportDetails = 'The spaces are marked differently now.';

        page.submitReport();

        expect(locationService.reportInconsistency).toHaveBeenCalledWith(7, {
            issueType: 'DETAILS_WRONG',
            details: 'The spaces are marked differently now.'
        });
        expect(page.reportSuccessMessage).toBe('Thanks, the report has been sent.');
    });

    it('blocks reports longer than two hundred characters', () => {
        page.marker = {id: 7} as Marker;
        page.reportIssueType = 'DETAILS_WRONG';
        page.reportDetails = 'x'.repeat(201);

        page.submitReport();

        expect(locationService.reportInconsistency).not.toHaveBeenCalled();
        expect(page.reportErrorMessage).toBe('Keep the report to 200 characters.');
    });

    it('requires a selected issue type', () => {
        page.marker = {id: 7} as Marker;
        page.reportDetails = 'The spaces are gone.';

        page.submitReport();

        expect(locationService.reportInconsistency).not.toHaveBeenCalled();
        expect(page.reportErrorMessage).toBe('Select the issue you want to report.');
    });

    it('allows no details when parking no longer exists', () => {
        page.marker = {id: 7} as Marker;
        page.reportIssueType = 'NO_LONGER_EXISTS';
        page.reportDetails = '';

        page.submitReport();

        expect(locationService.reportInconsistency).toHaveBeenCalledWith(7, {
            issueType: 'NO_LONGER_EXISTS',
            details: ''
        });
    });

    it('requires details when the issue needs an explanation', () => {
        page.marker = {id: 7} as Marker;
        page.reportIssueType = 'DETAILS_WRONG';
        page.reportDetails = '';

        page.submitReport();

        expect(locationService.reportInconsistency).not.toHaveBeenCalled();
        expect(page.reportErrorMessage).toBe('Tell us what needs to change at this spot.');
    });

    it('shows an error if the report api fails', () => {
        locationService.reportInconsistency.and.returnValue(throwError(() => new Error('nope')));
        page.marker = {id: 7} as Marker;
        page.reportIssueType = 'NO_LONGER_EXISTS';
        page.reportDetails = 'The spaces are gone.';

        page.submitReport();

        expect(page.reportErrorMessage).toBe('The report could not be sent. Please try again.');
    });
});
