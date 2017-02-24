import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { GeoLocation } from '../../interfaces';
import { GeoLocationService } from '../../services/geo-location.service';
import { RestaurantFinderService } from '../../services/restaurant-finder.service';

@Component({
    selector: 'app-location-page',
    templateUrl: './location-page.component.html',
    styleUrls: ['./location-page.component.css']
})
export class LocationPageComponent implements OnInit {
    location: GeoLocation;
    locationName: String;

    constructor(
        private router: Router,
        private geoLocationService: GeoLocationService,
        private restaurantFinderService: RestaurantFinderService
    ) { }

    ngOnInit() {
        this.locationName = '';
    }

    handleDetectLocation() {
        this.geoLocationService.getCurrentLocation()
            .subscribe(location => {
                this.location = location;
                this.locationName = this.location.name;
            });
    }

    handleGoClick() {
        if (this.location) {
            this.router.navigate(['search', 'pick'], { queryParams: this.location });
        }
    }
}
