import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GeoLocation } from '../../interfaces';
import { RestaurantFinderService, RestaurantImage } from '../../services/restaurant-finder.service';
import { Restaurant } from '../../interfaces';

@Component({
    selector: 'app-images-picker-page',
    templateUrl: './images-picker-page.component.html',
    styleUrls: ['./images-picker-page.component.css']
})
export class ImagesPickerPageComponent implements OnInit {
    currentLocation: GeoLocation;
    selectedImages: RestaurantImage[];
    availableImages: RestaurantImage[];

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private restaurantFinderService: RestaurantFinderService) {
    }

    ngOnInit() {
        this.selectedImages = [];
        this.currentLocation = {
            name: this.activatedRoute.snapshot.queryParams['name'],
            latitude: this.activatedRoute.snapshot.queryParams['latitude'],
            longitude: this.activatedRoute.snapshot.queryParams['longitude']
        };

        this._searchRestaurants();
    }

    handleImageClick(image: RestaurantImage) {
        this.selectedImages = [
            ...this.selectedImages,
            image
        ];
        this._searchRestaurants();
    }

    handleRestartSearch() {
        this.router.navigate(['search', 'location']);
    }

    _searchRestaurants() {
        const searchRequest = {
            location: this.currentLocation,
            selectedImages: this.selectedImages
        };
        this.restaurantFinderService.findRestaurants(searchRequest)
            .subscribe((result) => {
                if (result.isRestaurantFound) {
                    this.router.navigate(
                        ['search', 'results'],
                        { queryParams: Object.assign({}, this.currentLocation, { cuisine: result.cuisine }) }
                    );
                } else {
                    this.availableImages = result.images;
                }
            });
    }
}
