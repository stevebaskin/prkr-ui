import { Model }        from '../domain/Model';
import { Identifiable } from '../domain/Identifiable';
import { ApiService }   from '../../module/core/service/ApiService';
import { Observable }   from 'rxjs';
import * as URI         from 'urijs';
import { EventEmitter } from '@angular/core';

export abstract class BaseService<Resource extends Model & Identifiable> {

    protected abstract baseUri: string;

    protected eventEmitter: EventEmitter<Resource> = new EventEmitter();

    constructor(protected apiService: ApiService) {
    }

    public findOne(id: number): Observable<Resource> {
        return this.apiService.get(this.getResourceUri({id: id} as Identifiable));
    }

    public findAll(): Observable<Array<Resource>> {
        return this.apiService.get(this.getBaseUri());
    }

    public save(item: Resource): Observable<Resource> {
        return (item.id) ? this.update(item) : this.create(item);
    }

    private create(item: Resource): Observable<Resource> {
        return this.apiService.post(this.getBaseUri(), item).pipe(
            // tap(() => this.eventEmitter.emit(new Created<Resource>(item)))
        );
    }

    private update(item: Resource): Observable<Resource> {
        return this.apiService.put(this.getResourceUri(item), item).pipe(
            // tap(() => this.eventEmitter.emit(new Updated<Resource>(item)))
        );
    }

    public delete(item: Resource): Observable<Resource> {
        return this.apiService.delete(this.getResourceUri(item)).pipe(
            // tap(() => this.eventEmitter.emit(new Deleted<Resource>(item)))
        );
    }

    protected getBaseUri(): string {
        return this.baseUri;
    }

    protected getResourceUri(resource: Identifiable): string {
        return URI(this.getBaseUri())
            .segment(`${ resource.id }`) /* needs to be treating as a string */
            .toString();
    }

    public getEventEmitter(): EventEmitter<Resource> {
        return this.eventEmitter;
    }
}
