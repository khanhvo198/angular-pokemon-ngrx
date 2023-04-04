import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'pokemon-details',
  template: `
    <div class="flex gap-4 items-center justify-center">
      <button (click)="prevId()">
        <<
      </button>
      <pokemon-card [pokemon]="null"></pokemon-card>
      <button (click)="nextId()">
        >>
      </button>
    </div>

    <div class="flex w-1/3 px-4 justify-between items-center">
      <button class="border border-gray-600 px-4 py-2 rounded" (click)="like()">
        Like
      </button>
      <button
        class="border border-gray-600 px-4 py-2 rounded"
        (click)="dislike()"
      >
        Dislike
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        height: calc(100% - 5rem);
      }
    `
  ]
})
export class DetailsComponent {
  @HostBinding('class') hostClass =
    'flex flex-col gap-4 items-center justify-center';

  nextId() {
    // go to next id
  }

  prevId() {
    // go to prev id
  }

  like() {
    // like
  }

  dislike() {
    // dislike
  }
}
