import { EventEmitter, Injectable } from '@angular/core';
import { Marker }                   from '../domain/Marker';

@Injectable()
export class MarkerService {

    protected mapEventEmitter: EventEmitter<Marker> = new EventEmitter();

    public getMapEventEmitter(): EventEmitter<Marker> {
        return this.mapEventEmitter;
    }

}
