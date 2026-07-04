import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { LogoComponent } from './logo/logo.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true">
      <div class="page-layout">
        <app-logo></app-logo>
        <div class="search-overlay">
         <app-search-bar></app-search-bar>
        </div>
      </div>
    </ion-content>`,
  styles: `.page-layout {
      position: relative;
      min-height: 100%;

      app-logo {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
    }

    .search-overlay {
      position: fixed;
      bottom: 80px;
      left: 5%;
      width: 90%;
      z-index: 1;
    }`,
  imports: [IonContent, LogoComponent, SearchBarComponent],
})
export class HomePage {
  constructor() {}
  
}
