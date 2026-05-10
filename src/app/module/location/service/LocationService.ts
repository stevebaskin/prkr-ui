import { EventEmitter, Injectable } from '@angular/core';
import { BaseService }              from '../../../common/service/BaseService';
import { ApiService }               from '../../core/service/ApiService';
import { Location }                 from '../domain/Location';
import { Observable }               from 'rxjs';
import { environment }              from '../../../../environments/environment';

export interface LocationReportRequest {
    issueType: string;
    details: string;
}

@Injectable()
export class LocationService extends BaseService<Location> {

    protected baseUri = `${ environment.apiBaseUri }/api/locations`;

    protected mapEventEmitter: EventEmitter<Location> = new EventEmitter();

    protected formEventEmitter: EventEmitter<Location> = new EventEmitter();

    protected searchEventEmitter: EventEmitter<Location> = new EventEmitter();

    constructor(apiService: ApiService) {
        super(apiService);
    }

    public getMapEventEmitter(): EventEmitter<Location> {
        return this.mapEventEmitter;
    }

    public getFormEventEmitter(): EventEmitter<Location> {
        return this.formEventEmitter;
    }

    public getSearchEventEmitter(): EventEmitter<Location> {
        return this.searchEventEmitter;
    }

    public reportInconsistency(locationId: number, report: LocationReportRequest): Observable<void> {
        return this.apiService.post(`${ this.getBaseUri() }/${ locationId }/reports`, report);
    }

}
