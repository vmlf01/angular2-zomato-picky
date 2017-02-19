import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { GeoLocation } from '../interfaces';
import { Restaurant } from '../interfaces';

export interface FindRestaurantRequest {
    location: GeoLocation;
    selectedImages: RestaurantImage[];
}

export interface FindRestaurantResult {
    isRestaurantFound: boolean;
    location: GeoLocation;
    selectedImages: RestaurantImage[];
    images?: RestaurantImage[];
    restaurantId?: string;
    cuisine?: string;
}

export interface RestaurantImage {
    restaurantId: string;
    cuisines: string[];
    url: string;
}

interface RestaurantsCache {
    location: GeoLocation;
    images: RestaurantImage[];
}

@Injectable()
export class RestaurantFinderService {
    private restaurantsCache?: RestaurantsCache = null;

    constructor(private http: Http) { }

    findRestaurants(request: FindRestaurantRequest): Observable<FindRestaurantResult> {
        return new Observable<FindRestaurantResult>((observer) => {
            observer.next(this._checkForCuisineResult(request));
            observer.complete();
        })
            .mergeMap(searchResult => searchResult.isRestaurantFound ?
                Observable.of(searchResult) :
                this._getMoreRestaurantImages(request)
                    .map(images => {
                        return Object.assign({}, request, {
                            isRestaurantFound: false,
                            images: images
                        }) as FindRestaurantResult;
                    })
            );
    }

    getTopRestaurantsByCuisine(location: GeoLocation, cuisine: string, count: number): Observable<Restaurant[]> {
        return this._getTopRestaurantsByCuisineFromAPI(location, cuisine)
            .map(results => results.filter((restaurant, index) => index < count));
    }

    _checkForCuisineResult(currentSearch: FindRestaurantRequest): FindRestaurantResult {
        const resultsByCuisines = currentSearch.selectedImages.reduce((cuisines, image) => {
            image.cuisines.forEach(cuisine => {
                if (!cuisines[cuisine]) {
                    cuisines[cuisine] = { cuisine: cuisine, count: 0, images: [] };
                }

                cuisines[cuisine].count++;
                cuisines[cuisine].images.push(image);
            });

            return cuisines;
        }, {});

        const sortedCuisines = Object.keys(resultsByCuisines)
            .map(key => resultsByCuisines[key])
            .sort((c1, c2) => c1.count < c2.count ? 1 : -1);

        if (sortedCuisines.length && sortedCuisines[0].count > 3) {
            // we found a cuisine type that has been selected more than 3 times
            return Object.assign({}, currentSearch, {
                isRestaurantFound: true,
                cuisine: sortedCuisines[0].cuisine
            });
        }

        return Object.assign({}, currentSearch, {
            isRestaurantFound: false
        });
    }

    _getMoreRestaurantImages(currentSearch: FindRestaurantRequest, numberOfImages = 8): Observable<RestaurantImage[]> {
        return new Observable<RestaurantImage[]>((observer) => {
            observer.next(this._getRestaurantImagesFromCache(currentSearch));
            observer.complete();
        })
            .flatMap(images => images ?
                Observable.of(images) :
                Observable.forkJoin([
                    this._getRestaurantImagesFromAPI(currentSearch, 0),
                    this._getRestaurantImagesFromAPI(currentSearch, 1),
                    this._getRestaurantImagesFromAPI(currentSearch, 2)
                ])
                    .map(results => [].concat(results[0], results[1], results[2]))
                    .map(apiImages => {
                        // update local images cache
                        this._putRestaurantImagesInCache(currentSearch, apiImages);
                        return apiImages;
                    })
            )
            .map(images => this._getRandomRestaurantImages(images, currentSearch.selectedImages, numberOfImages));
    }

    _getRandomRestaurantImages(images: RestaurantImage[], excludedImages: RestaurantImage[], numberOfImages: number): RestaurantImage[] {
        return images
            .filter(img => excludedImages.every(img2 => img.url !== img2.url))
            .sort(() => 0.5 - Math.random())
            .filter((img, index) => index < numberOfImages);
    }

    _getRestaurantImagesFromCache(request: FindRestaurantRequest) {
        if (this.restaurantsCache &&
            this.restaurantsCache.location.latitude === request.location.latitude &&
            this.restaurantsCache.location.longitude === request.location.longitude) {
            return this.restaurantsCache.images;
        }

        return null;
    }

    _putRestaurantImagesInCache(request: FindRestaurantRequest, images: RestaurantImage[]) {
        this.restaurantsCache = {
            location: request.location,
            images: images
        };
    }

    _getRestaurantImagesFromAPI(request: FindRestaurantRequest, pageNumber = 0): Observable<RestaurantImage[]> {
        const qsParams = new URLSearchParams();
        qsParams.set('lat', request.location.latitude.toString());
        qsParams.set('lon', request.location.longitude.toString());
        qsParams.set('start', (pageNumber * 20).toString());
        qsParams.set('sort', 'real_distance');
        qsParams.set('order', 'asc');

        return this.http.get('https://developers.zomato.com/api/v2.1/search', {
            search: qsParams,
            headers: new Headers(
                {
                    'user-key': 'a7501616e43e2cb08e91bfc32bbc8b3a',
                    'Accept': 'application/json'
                }
            )
        })
            .map(response => response.json())
            .map(response => this._extractRestaurantImages(response));
    }

    _extractRestaurantImages(response): RestaurantImage[] {
        return response.restaurants.map(item => {
            return {
                restaurantId: item.restaurant.id,
                cuisines: item.restaurant.cuisines ? item.restaurant.cuisines.split(',').map(cuisine => cuisine.trim()) : [],
                url: item.restaurant.featured_image || item.restaurant.thumb,
            };
        }).filter(image => image.url);
    }

    _getTopRestaurantsByCuisineFromAPI(location: GeoLocation, cuisine: string): Observable<Restaurant[]> {
        const qsParams = new URLSearchParams();
        qsParams.set('lat', location.latitude.toString());
        qsParams.set('lon', location.longitude.toString());
        qsParams.set('sort', 'rating');
        qsParams.set('order', 'desc');

        return this.http.get('https://developers.zomato.com/api/v2.1/search', {
            search: qsParams,
            headers: new Headers(
                {
                    'user-key': 'a7501616e43e2cb08e91bfc32bbc8b3a',
                    'Accept': 'application/json'
                }
            )
        })
            .map(response => response.json())
            .map(response => this._extractRestaurantDetails(response));
    }

    _extractRestaurantDetails(response): Restaurant[] {
        return response.restaurants.map(item => {
            return {
                id: item.restaurant.id,
                name: item.restaurant.name,
                rating: item.restaurant.user_rating.aggregate_rating || 'N/A',
                cuisines: item.restaurant.cuisines ? item.restaurant.cuisines.split(',').map(cuisine => cuisine.trim()) : [],
                imageUrl: item.restaurant.featured_image || item.restaurant.thumb,
                detailsUrl: item.restaurant.url,
            };
        }).filter(restaurant => restaurant.imageUrl);
    }
}
