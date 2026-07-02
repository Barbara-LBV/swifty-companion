import { Component, OnInit } from '@angular/core';
import { IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';


@Component({
  selector: 'app-cursus',
  standalone: true,
  imports: [IonItem, IonList, IonSelect, IonSelectOption],
  templateUrl: './cursus.component.html',
  styleUrls: ['./cursus.component.scss'],
})
export class CursusComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
