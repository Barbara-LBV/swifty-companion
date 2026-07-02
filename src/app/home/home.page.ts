import { Component } from '@angular/core';
import { IonContent, IonImg} from '@ionic/angular/standalone';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, SearchBarComponent, IonImg],
})
export class HomePage {
  constructor() {}
  
}
