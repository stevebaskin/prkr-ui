import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {

    constructor(private httpClient: HttpClient) {
    }

    get(url: string): Observable<any> {
        return this.httpClient.get(url);
    }

    post(url: string, data: any): Observable<any> {
        return this.httpClient.post(url, data);
    }

    put(url: string, data: any): Observable<any> {
        return this.httpClient.put(url, data);
    }

    delete(url: string): Observable<any> {
        return this.httpClient.delete(url);
    }

}
