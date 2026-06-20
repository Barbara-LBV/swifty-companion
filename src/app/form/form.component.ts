import {Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/** @title Simple form field */
@Component({
  standalone: true,
  selector: 'FormComponent',
  templateUrl: 'form.component.html',
  styleUrl: 'form.component.scss',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
})
export class FormComponent {}
