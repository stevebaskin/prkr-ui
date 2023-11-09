import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LocationService }                                 from '../../module/location/service/LocationService';
import { GoogleMap }                                       from '@angular/google-maps';
import { Router }                                          from '@angular/router';
import { Location }                                        from '../../module/location/domain/Location';
import { MarkerService }                                   from '../../module/location/service/MarkerService';
import { Marker }                                          from '../../module/location/domain/Marker';


@Component({
    selector: AppMapComponent.selector,
    styleUrls: ['../style/app-map.scss'],
    templateUrl: '../template/app-map.html',
})
export class AppMapComponent implements OnInit {
    static readonly selector: string = 'app-map';

    @ViewChild(GoogleMap, {static: false}) map: GoogleMap;

    zoom = 12;
    bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
    markers = [];
    currentLocationMarker;
    currentLocationIcon = '/asset/icon/motorbike.png';
    searchLocationMarker;
    searchLocationIcon = '/asset/icon/you-are-here.png';

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
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
                this.createMarker(event);
                this.map.fitBounds(this.bounds);

                const listener = this.map.googleMap.addListener('bounds_changed', function (event) {
                    if (this.getZoom() > 14) {
                        this.setZoom(14);
                    }
                });

                setTimeout(function () {
                    google.maps.event.removeListener(listener);
                }, 100);

            }
            else {
                this.getLocations();
            }

        });

        this.locationService.getSearchEventEmitter().subscribe(event => {
            if (event) {
                const latLng = new google.maps.LatLng(event.latitude, event.longitude);

                this.bounds.extend(latLng);
                this.map.fitBounds(this.bounds);

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
