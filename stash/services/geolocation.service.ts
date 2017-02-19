import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  'rxjs/add/operator/map';
import  'rxjs/add/operator/mergeMap';
import  'rxjs/add/operator/catch';

export interface GeoLocation {
    name?: string;
    latitude: number;
    longitude: number;
}

@Injectable()
export class GeoLocationService {
    constructor(private http: Http) {
    }

    getLocation(): Observable<GeoLocation> {
        return this._getGeoCoordinates()
            .flatMap((location) => this._getLocationName(location));
    }

    _getGeoCoordinates(): Observable<GeoLocation> {
        return Observable.create(observer => {
            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(
                    (position) => {
                        observer.next({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        observer.complete();
                    },
                    (error) => {
                        observer.error(error);
                    }
                );
            } else {
                observer.error(new Error('Geolocation API is not available'));
            }
        });
    }

    _getLocationName(location: GeoLocation) {
        return new Observable<GeoLocation>(observer => {
            const qsParams = new URLSearchParams();
            qsParams.set('lat', location.latitude.toString());
            qsParams.set('lon', location.longitude.toString());

            this.http.get('https://developers.zomato.com/api/v2.1/cities', {
                search: qsParams,
                headers: new Headers(
                    {
                        'user-key': 'a7501616e43e2cb08e91bfc32bbc8b3a',
                        'Accept': 'application/json'
                    }
                )
            })
            .map(response => response.json())
            .map(response => this._extractLocationName(response))
            .catch(error => observer.error(error))
            .subscribe(locationName => {
                observer.next(Object.assign({}, location, { name: locationName }));
                observer.complete();
            });
        });
    }

    _extractLocationName(response): String {
        if (response && response.location_suggestions && response.location_suggestions[0]) {
            return `${response.location_suggestions[0].name}, ${response.location_suggestions[0].country_name}`;
        }
        return '';
    }
}
