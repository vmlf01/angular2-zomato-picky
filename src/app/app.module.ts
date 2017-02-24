import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from './app.routes';

import { GeoLocationService } from './services/geo-location.service';
import { RestaurantFinderService } from './services/restaurant-finder.service';

import { AppComponent } from './app.component';
import { HomePageComponent } from './containers/home-page';
import { ImageCardComponent } from './components/image-card';
import { ImagesPickerPageComponent } from './containers/images-picker-page';
import { LocationPageComponent } from './containers/location-page';
import { SearchResultsPageComponent } from './containers/search-results-page';
import { AppHeaderComponent } from './components/app-header/app-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ImageCardComponent,
    ImagesPickerPageComponent,
    LocationPageComponent,
    SearchResultsPageComponent,
    AppHeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(AppRoutes),
  ],
  providers: [
    GeoLocationService,
    RestaurantFinderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
