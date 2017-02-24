import { Routes } from '@angular/router';

import { HomePageComponent } from './containers/home-page';
import { LocationPageComponent } from './containers/location-page';
import { ImagesPickerPageComponent } from './containers/images-picker-page';
import { SearchResultsPageComponent } from './containers/search-results-page';

export const AppRoutes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'search/location', component: LocationPageComponent },
    { path: 'search/pick', component: ImagesPickerPageComponent },
    { path: 'search/results', component: SearchResultsPageComponent },
    { path: '**', redirectTo: 'home' },
];
