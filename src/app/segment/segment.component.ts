import { Component, effect, input, signal } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton, 
  IonAccordionGroup, IonAccordion, IonItem, IonBadge, IonList } from '@ionic/angular/standalone';
import { SkillUser, GroupedProject } from '../student/student.service';

export type Segment = 'projects' | 'skills';

@Component({
  selector: 'app-segment',
  standalone: true,
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
  imports: [IonLabel, IonSegment, IonSegmentButton, IonAccordionGroup, IonAccordion, 
    IonItem, IonBadge, IonList]
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
