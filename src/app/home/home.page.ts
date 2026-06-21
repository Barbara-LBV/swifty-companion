import { Component } from '@angular/core';
import { IonContent, IonImg} from '@ionic/angular/standalone';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, SearchBarComponent, LogoComponent],
})
export class HomePage {
  constructor() {}
}
