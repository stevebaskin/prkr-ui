import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LocationService }                                 from '../../module/location/service/LocationService';
import { GoogleMap, MapInfoWindow, MapMarker }             from '@angular/google-maps';
import { Router }                                          from '@angular/router';
import { Location }                                        from '../../module/location/domain/Location';


@Component({
    selector: AppMapComponent.selector,
    styleUrls: ['../style/app-map.scss'],
    templateUrl: '../template/app-map.html',
})
export class AppMapComponent implements OnInit {
    static readonly selector: string = 'app-map';

    @ViewChild(GoogleMap, {static: false}) map: GoogleMap;
    @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

    zoom = 12;
    bounds: google.maps.LatLngBounds;
    markers = [];
    infoContent = '';
    currentLocation: google.maps.LatLng;
    icon = 'http://www.robotwoods.com/dev/misc/bluecircle.png';

    constructor(
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private locationService: LocationService) {
    }

    ngOnInit() {
        this.initSubscription();
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

    private initSubscription(): void {
        this.locationService.getFormEventEmitter().subscribe(event => {
            this.bounds = new google.maps.LatLngBounds();
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

        this.markers.push({
            position: latLng,
            info: location.name,
        });

        this.bounds.extend(latLng);
    }

    onClick(marker: MapMarker, content) {
        if (content) {
            this.infoContent = content;
            this.infoWindow.open(marker);
        }
    }

}
