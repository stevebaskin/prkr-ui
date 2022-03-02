import { Injectable }  from '@angular/core';
import { BaseService } from '../../../common/service/BaseService';
import { ApiService }  from '../../core/service/ApiService';
import { Location }    from '../domain/Location';

@Injectable()
export class LocationService extends BaseService<Location> {

    protected baseUri = '/api/locations';

    constructor(apiService: ApiService) {
        super(apiService);
    }

}
