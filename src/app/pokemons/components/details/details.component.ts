import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { DetailStore } from './details.store';

@Component({
  selector: 'pokemon-details',
  template: `
  <ng-container *ngIf="(vm$ | async) as vm">
    <div class="flex gap-4 items-center justify-center">
      <button (click)="prevId()">
        <<
      </button>
      <pokemon-card [pokemon]="vm.pokemon"></pokemon-card>
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
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        height: calc(100% - 5rem);
      }
    `,
  ],
  providers: [DetailStore],
})
export class DetailsComponent {
  @HostBinding('class') hostClass =
    'flex flex-col gap-4 items-center justify-center';

  vm$ = this.detailStore.vm$;
  constructor(private detailStore: DetailStore) {}

  nextId() {
    // go to next id
    this.detailStore.nextIdEffect();
  }

  prevId() {
    // go to prev id
    this.detailStore.prevIdEffect();
  }

  like() {
    // like
    this.detailStore.likeEffect();
  }

  dislike() {
    // dislike
    this.detailStore.dislikeEffect();
  }
}
