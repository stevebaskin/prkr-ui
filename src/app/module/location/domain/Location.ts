import { Identifiable } from '../../../common/domain/Identifiable';
import { Model }        from '../../../common/domain/Model';
import { Nameable }     from '../../../common/domain/Nameable';

export class Location implements Model, Identifiable, Nameable {

    id: number = null;

    name: string = null;

    latitude: number = null;

    longitude: number = null;

    size: number = null;

    allDay: boolean = true;

    hourLimit: number = null;

    restrictedHours: boolean = false;

    startTime: Date = null;

    endTime: Date = null;

}
