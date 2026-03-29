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
    selectedMarkerKey: string = null;
    currentLocationMarker;
    searchLocationMarker;
    searchLocationIcon = '/asset/icon/you-are-here.png';
    parkingMarkerIcon = {
        url: '/asset/icon/motorbike.png',
        scaledSize: new google.maps.Size(48, 48)
    };
    selectedParkingMarkerIcon = {
        url: '/asset/icon/motorbike.png',
        scaledSize: new google.maps.Size(96, 96)
    };
    unselectedParkingMarkerIcon = {
        url: '/asset/icon/motorbike-grey.png',
        scaledSize: new google.maps.Size(48, 48)
    };
    parkingMarkerOptions: google.maps.MarkerOptions = {
        opacity: 0.85,
        zIndex: 1
    };
    selectedParkingMarkerOptions: google.maps.MarkerOptions = {
        opacity: 1,
        zIndex: 1000
    };
    
    mapOptions: google.maps.MapOptions = {};
    private readonly mapClickAfterDragGuardMs: number = 250;
    private lastMapDragEndAtMs: number = 0;

    constructor(
        private cdRef: ChangeDetectorRef,
        private locationService: LocationService,
        private markerService: MarkerService
    ) {
        this.setMapOptions();
    }

    ngOnInit() {
        this.initSubscriptions();
        this.setCurrentLocation();
    }

    ngAfterViewInit() {
        this.map.googleMap.addListener('dragend', () => {
            this.lastMapDragEndAtMs = Date.now();
        });

        this.map.googleMap.addListener('click', (event) => {
            const didJustDragMap = (Date.now() - this.lastMapDragEndAtMs) < this.mapClickAfterDragGuardMs;
            if (didJustDragMap) {
                return;
            }

            if (this.selectedMarkerKey !== null) {
                this.selectedMarkerKey = null;
                this.markerService.getMapEventEmitter().emit(null as any);
            }

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
        const markerKey = this.getMarkerSelectionKey(marker);
        const isToggleOff = markerKey !== null && markerKey === this.selectedMarkerKey;

        if (isToggleOff) {
            this.selectedMarkerKey = null;
            this.markerService.getMapEventEmitter().emit(null as any);
            return;
        }

        this.selectedMarkerKey = markerKey;
        this.markerService.getMapEventEmitter().emit(marker);
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    getParkingMarkerIcon(marker: Marker): google.maps.Icon {
        if (!this.isMarkerSelected()) {
            return this.parkingMarkerIcon;
        }

        return this.isSelectedMarker(marker) ? this.selectedParkingMarkerIcon : this.unselectedParkingMarkerIcon;
    }

    getParkingMarkerOptions(marker: Marker): google.maps.MarkerOptions {
        if (!this.isMarkerSelected()) {
            return this.parkingMarkerOptions;
        }

        return this.isSelectedMarker(marker) ? this.selectedParkingMarkerOptions : this.parkingMarkerOptions;
    }

    setCurrentLocation() {
        navigator.geolocation.getCurrentPosition(async (position) => {
            this.currentLocationMarker = {
                name: 'This is you!',
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            };
        });
    }

    private setMapOptions(): void {
        // Only add map type controls if viewport is larger than small-device-min-width (600px)
        if (window.innerWidth > 600) {
            this.mapOptions = {
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT,
                }
            };
        }
    }

    private initSubscriptions(): void {
        this.locationService.getFormEventEmitter().subscribe(event => {
            this.markers = [];
            this.selectedMarkerKey = null;

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

        this.markerService.getMapEventEmitter().subscribe(event => {
            if (!event) {
                this.selectedMarkerKey = null;
            }
        });
    }

    private isMarkerSelected(): boolean {
        return this.selectedMarkerKey !== null;
    }

    private isSelectedMarker(marker: Marker): boolean {
        return this.selectedMarkerKey !== null && this.getMarkerSelectionKey(marker) === this.selectedMarkerKey;
    }

    private getMarkerSelectionKey(marker: Marker): string {
        if (marker && marker.id !== null && marker.id !== undefined) {
            return `id:${ marker.id }`;
        }

        if (marker && marker.position) {
            return `pos:${ marker.position.lat() },${ marker.position.lng() }`;
        }

        return null;
    }
}
