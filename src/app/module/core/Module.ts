import { NgModule }         from '@angular/core';
import { ApiService }       from './service/ApiService';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule,
    ],
    providers: [
        ApiService,
    ],
})
export class Module {
}
