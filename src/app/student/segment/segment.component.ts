import { Component, effect, input, signal } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton,
  IonAccordionGroup, IonAccordion, IonItem, IonBadge, IonList, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown } from 'ionicons/icons';
import { SkillUser, GroupedProject } from '../student.service';

addIcons({ 'chevron-down': chevronDown });

export type Segment = 'projects' | 'skills';

@Component({
  selector: 'app-segment',
  standalone: true,
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
  imports: [IonLabel, IonSegment, IonSegmentButton, IonAccordionGroup, IonAccordion,
    IonItem, IonBadge, IonList, IonIcon]
})
export class SegmentComponent {
  projects = input.required<GroupedProject[]>();
  skills = input.required<SkillUser[]>();
  segment = signal<Segment>('projects');

  constructor() {
    effect(() => console.log('projects', this.projects()));
  }

  onSegmentChange(value: string | number | undefined) {
    if (value === 'projects' || value === 'skills') {
      this.segment.set(value);
    }
  }
}
