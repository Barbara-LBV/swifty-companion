import { Component, computed, effect, input, output, signal } from '@angular/core';
import { IonChip } from '@ionic/angular/standalone';
import { CursusUser } from '../student.service';

@Component({
  selector: 'app-cursus',
  standalone: true,
  imports: [IonChip],
  template: `<div class="cursus-selector">
    @for (cu of cursusOptions(); track cu.cursus.id) {
      <ion-chip
        [outline]="selected() !== cu.cursus.id"
        [color]="selected() === cu.cursus.id ? 'primary' : 'medium'"
        (click)="selectCursus(cu.cursus.id)">
        {{ cu.cursus.name }}
      </ion-chip>
    }
  </div>`,
  styles: `.cursus-selector {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px;
      padding: 0 16px;
    }`
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

  selectCursus(cursusId: number) {
    this.selected.set(cursusId);
  }
}
