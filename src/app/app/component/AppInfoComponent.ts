import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: AppInfoComponent.selector,
    styleUrls: ['../style/app-info.scss'],
    templateUrl: '../template/app-info.html',
    standalone: false
})
export class AppInfoComponent {
    static readonly selector: string = 'app-info';

    constructor(public router: Router) {}
}
