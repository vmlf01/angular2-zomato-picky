import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from './app.routes';

import { RestaurantFinderService } from './services/restaurant-finder.service';

import { AppComponent } from './app.component';
import { HomePageComponent } from './containers/home-page';
import { ImageCardComponent } from './components/image-card';
import { ImagesPickerPageComponent } from './containers/images-picker-page';
import { LocationPageComponent } from './containers/location-page';
import { SearchResultsPageComponent } from './containers/search-results-page';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ImageCardComponent,
    ImagesPickerPageComponent,
    LocationPageComponent,
    SearchResultsPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(AppRoutes),
  ],
  providers: [
    RestaurantFinderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
