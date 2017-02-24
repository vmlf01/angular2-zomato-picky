import { Component, Input } from '@angular/core';
import { Restaurant } from '../../interfaces';

@Component({
    selector: 'app-restaurant-card',
    templateUrl: './restaurant-card.component.html',
    styleUrls: ['./restaurant-card.component.css']
})
export class RestaurantCardComponent {
    @Input() restaurant: Restaurant;
}
