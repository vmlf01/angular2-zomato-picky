import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    styleUrls: [
        `./app-header.component.css`
    ],
    template: `
        <div class="app-header">
            <div class="app-logo" routerLink="['home']">
                <img class="app-icon" src="../assets/app-icon.png">
                <div class="app-title-container">
                    <div class="app-title main-color">zomato</div>
                    <div class="app-title accent-color">picky!</div>
                </div>
            </div>
        </div>
    `
})
export class AppHeaderComponent {
}
