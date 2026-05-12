import { NgModule }         from '@angular/core';
import { ApiService }       from './service/ApiService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
    providers: [
        ApiService,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class Module {
}
