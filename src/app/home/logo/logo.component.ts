import { Component, OnInit } from '@angular/core';
import { IonImg} from '@ionic/angular/standalone';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [IonImg],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
