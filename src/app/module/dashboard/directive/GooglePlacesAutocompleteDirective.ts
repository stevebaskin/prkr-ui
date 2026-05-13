import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    Output,
} from '@angular/core';


@Directive({
    selector: '[appGooglePlacesAutocomplete]',
    standalone: false
})
export class GooglePlacesAutocompleteDirective implements AfterViewInit, OnDestroy {

    @Input() options: google.maps.places.AutocompleteOptions = {};
    @Output() onAddressChange = new EventEmitter<google.maps.places.PlaceResult>();

    private autocomplete: google.maps.places.Autocomplete;
    private listener: google.maps.MapsEventListener;

    constructor(
        private elementRef: ElementRef<HTMLInputElement>,
        private ngZone: NgZone,
    ) {
    }

    ngAfterViewInit(): void {
        this.autocomplete = new google.maps.places.Autocomplete(this.elementRef.nativeElement, this.options);
        this.listener = this.autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
                this.onAddressChange.emit(this.autocomplete.getPlace());
            });
        });
    }

    ngOnDestroy(): void {
        if (this.listener) {
            this.listener.remove();
        }
    }

}
