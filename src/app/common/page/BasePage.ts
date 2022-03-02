import { BaseComponent } from '../component/BaseComponent';
import { Injectable }    from '@angular/core';

@Injectable()
export abstract class BasePage extends BaseComponent {

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public abstract getTitle(): string;

    public getSubtitle(): string {
        return null;
    }


}