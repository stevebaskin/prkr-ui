import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LocationService }                                                from '../../module/location/service/LocationService';
import { GoogleMap }                                                      from '@angular/google-maps';
import { Location }                                                       from '../../module/location/domain/Location';
import { MarkerService }                                                  from '../../module/location/service/MarkerService';
import { Marker }                                                         from '../../module/location/domain/Marker';


@Component({
    selector: AppMapComponent.selector,
    templateUrl: '../template/app-map.html',
})
export class AppMapComponent implements OnInit, AfterViewInit {
    static readonly selector: string = 'app-map';

    @ViewChild(GoogleMap, {static: false}) map: GoogleMap;

    zoom = 17;
    bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
    markers = [];
    currentLocationMarker;
    currentLocationIcon = '/asset/icon/motorbike.png';
    searchLocationMarker;
    searchLocationIcon = '/asset/icon/you-are-here.png';

    constructor(
        private cdRef: ChangeDetectorRef,
        private locationService: LocationService,
        private markerService: MarkerService
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.setCurrentLocation();
    }

    ngAfterViewInit() {
        this.map.googleMap.addListener('click', (event) => {
            if (this.markers.length <= 1) {
                this.bounds = new google.maps.LatLngBounds();
                this.markers = [];

                const location: Location = new Location();
                location.latitude = event.latLng.lat();
                location.longitude = event.latLng.lng();
                this.createMarker(location);

                this.locationService.getMapEventEmitter().emit(location);
                this.cdRef.detectChanges();
            }
        });
    }

    getLocations() {
        this.locationService.findAll().subscribe(locations => {
            locations.map(location => {
                this.createMarker(location);
            });
            this.map.fitBounds(this.bounds);
        });
    }

    createMarker(location: Location) {
        const latLng = new google.maps.LatLng(location.latitude, location.longitude);
        const startTime = location.startTime ? new Date('1990-01-01T' + location.startTime) : null;
        const endTime = location.endTime ? new Date('1990-01-01T' + location.endTime) : null;

        this.markers.push({
            ...location,
            position: latLng,
            startTime,
            endTime
        });

        this.bounds.extend(latLng);
    }

    onClick(marker: Marker) {
        this.markerService.getMapEventEmitter().emit(marker);
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    setCurrentLocation() {
        navigator.geolocation.getCurrentPosition(async (position) => {
            this.currentLocationMarker = {
                name: 'This is you!',
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            };
        });
    }

    private initSubscriptions(): void {
        this.locationService.getFormEventEmitter().subscribe(event => {
            this.markers = [];

            if (event) {
                this.bounds = new google.maps.LatLngBounds();
                this.createMarker(event);
                this.map.fitBounds(this.bounds);
                this.zoom = this.zoom + 0.000001;
            }
            else {
                this.getLocations();
            }

        });

        this.locationService.getSearchEventEmitter().subscribe(event => {
            if (event) {
                const latLng = new google.maps.LatLng(event.latitude, event.longitude);
                this.bounds = new google.maps.LatLngBounds();
                this.bounds.extend(latLng);
                this.map.fitBounds(this.bounds);

                // This is disgusting but ngOnChanges requires a change
                this.zoom = this.zoom + 0.000001;


                this.searchLocationMarker = {
                    name: event.name,
                    position: latLng
                };
            }
            else {
                this.searchLocationMarker = null;
            }
        });
    }
}
