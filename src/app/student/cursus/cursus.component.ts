import { Component, computed, effect, input, output, signal } from '@angular/core';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { CursusUser } from '../student.service';

@Component({
  selector: 'app-cursus',
  standalone: true,
  imports: [IonSegment, IonSegmentButton, IonLabel],
  templateUrl: './cursus.component.html',
  styleUrls: ['./cursus.component.scss'],
})
export class CursusComponent {
  cursusUsers = input.required<CursusUser[]>();
  cursusChange = output<number>();

  selected = signal<number | null>(null);

  cursusOptions = computed(() => {
    const seen = new Set<number>();
    return this.cursusUsers().filter(cu => !seen.has(cu.cursus.id) && seen.add(cu.cursus.id));
  });

  constructor() {
    effect(() => {
      const users = this.cursusOptions();
      if (users.length > 0 && this.selected() === null) {
        const main = users.find(cu => cu.cursus.slug === '42cursus');
        this.selected.set((main ?? users[0]).cursus.id);
      }
    });

    effect(() => {
      const id = this.selected();
      if (id !== null) {
        this.cursusChange.emit(id);
      }
    });
  }

  onChange(value: string | number | undefined) {
    if (value !== undefined) {
      this.selected.set(Number(value));
    }
  }
}
