import { Identifiable } from '../../../common/domain/Identifiable';
import { Model }        from '../../../common/domain/Model';
import { JsonProperty } from 'json-object-mapper';
import { Nameable }     from '../../../common/domain/Nameable';

export class Location implements Model, Identifiable, Nameable {

    @JsonProperty()
    id: number = null;

    @JsonProperty()
    name: string = null;

    @JsonProperty()
    size: number = null;

    @JsonProperty()
    latitude: number = null;

    @JsonProperty()
    longitude: number = null;

}
