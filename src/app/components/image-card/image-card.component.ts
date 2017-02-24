import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent {
    @Input() imageUrl: string;
}
