import { EventEmitter, Injectable } from '@angular/core';
import { BaseService }              from '../../../common/service/BaseService';
import { Marker }                   from '../domain/Marker';

@Injectable()
export class MarkerService extends BaseService<Marker> {

    protected baseUri;

    protected mapEventEmitter: EventEmitter<Marker> = new EventEmitter();

    public getMapEventEmitter(): EventEmitter<Marker> {
        return this.mapEventEmitter;
    }

}
