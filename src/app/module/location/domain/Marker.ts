import { Model }        from '../../../common/domain/Model';
import { Nameable }     from '../../../common/domain/Nameable';
import { Identifiable } from '../../../common/domain/Identifiable';

export class Marker implements Model, Identifiable, Nameable {

    id: number;

    name: string = null;

    size: number = null;

    position: google.maps.LatLng = null;

}
