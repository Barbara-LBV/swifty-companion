import { Component } from '@angular/core';
import { IonButton, ToastController } from '@ionic/angular/standalone';
import {FormComponent} from '../form/form.component';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss'],
  imports: [IonButton, FormComponent],
})
export class IndexPage {
  constructor(private toastController: ToastController) {}

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Hello World!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}