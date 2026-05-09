import { LocationService } from './LocationService';

describe('LocationService', () => {
    it('posts inconsistency reports to the selected location report endpoint', () => {
        const apiService = {
            post: jasmine.createSpy('post')
        };
        const service = new LocationService(apiService as any);

        service.reportInconsistency(42, {
            issueType: 'OTHER',
            details: 'Needs checking.'
        });

        expect(apiService.post).toHaveBeenCalledWith('http://localhost:8080/api/locations/42/reports', {
            issueType: 'OTHER',
            details: 'Needs checking.'
        });
    });
});
