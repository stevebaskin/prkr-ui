import { EventEmitter, Injectable } from '@angular/core';
import { BaseService }              from '../../../common/service/BaseService';
import { ApiService }  from '../../core/service/ApiService';
import { Location }    from '../domain/Location';

@Injectable()
export class LocationService extends BaseService<Location> {

    // protected baseUri = 'http://localhost:8080/api/locations';
    protected baseUri = 'https://park.ap-southeast-2.elasticbeanstalk.com/api/locations';

    protected mapEventEmitter: EventEmitter<Location> = new EventEmitter();

    protected infoEventEmitter: EventEmitter<Location> = new EventEmitter();

    constructor(apiService: ApiService) {
        super(apiService);
    }

    public getMapEventEmitter(): EventEmitter<Location> {
        return this.mapEventEmitter;
    }

    public getFormEventEmitter(): EventEmitter<Location> {
        return this.infoEventEmitter;
    }

}
