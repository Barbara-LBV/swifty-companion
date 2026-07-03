import { Component, OnInit } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [IonImg],
  template: `<ion-img src="assets/images/42logo.jpg"></ion-img>`,
  styles: `ion-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    }`,
})
export class LogoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
