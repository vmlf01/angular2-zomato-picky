import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GeoLocation } from '../../interfaces';
import { Restaurant } from '../../interfaces';

import { RestaurantFinderService } from '../../services/restaurant-finder.service';

@Component({
    selector: 'app-search-results-page',
    templateUrl: './search-results-page.component.html',
    styleUrls: ['./search-results-page.component.css']
})
export class SearchResultsPageComponent implements OnInit {
    currentLocation: GeoLocation;
    cuisine: string;
    results: Restaurant[];

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private restaurantFinderService: RestaurantFinderService) {
    }

    ngOnInit() {
        this.currentLocation = {
            name: this.activatedRoute.snapshot.queryParams['name'],
            latitude: this.activatedRoute.snapshot.queryParams['latitude'],
            longitude: this.activatedRoute.snapshot.queryParams['longitude']
        };
        this.cuisine = this.activatedRoute.snapshot.queryParams['cuisine'];

        if (this.cuisine) {
            this._loadCuisineRestaurants(this.currentLocation, this.cuisine);
        } else {
            this.router.navigate(['home']);
        }
    }

    handleRestartSearch() {
        this.router.navigate(['search', 'location']);
    }

    _loadCuisineRestaurants(location, cuisine) {
        this.restaurantFinderService.getTopRestaurantsByCuisine(location, cuisine, 3)
            .subscribe(restaurants => this.results = restaurants);
    }
}
