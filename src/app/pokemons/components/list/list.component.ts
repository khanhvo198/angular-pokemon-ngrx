import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import type { PaginatorState } from '../../../components/paginator/paginator.component';
import { ListStore } from './list.store';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pokemon-list',
  template: `
    <ng-container *ngIf="(vm$ | async) as vm">
    <paginator
      [currentPage]="vm.currentPage"
      [rowsPerPageOptions]="[10, 20, 40, 80]"
      [rows]="20"
      [totalRecords]="vm.total"
      (onPageChange)="onPageChanged($event)"
    ></paginator>
    <input
      type="text"
      class="w-2/4 p-2 rounded border border-gray-600"
      placeholder="Filter by pokemon name..."
      [formControl]="query"
    />
    <data-table [isLoading]="vm.isLoading" [data]="vm.pokemons"></data-table>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ListStore],
})
export class ListComponent {
  query = new FormControl('');
  vm$ = this.listStore.vm$;
  constructor(private listStore: ListStore) {}

  ngOnInit() {
    this.listStore.setQuery(this.query.valueChanges.pipe(debounceTime(250)));
    this.listStore.initEffect();
  }

  onPageChanged(paginatorState: PaginatorState) {
    this.listStore.setPagination({
      currentPage: paginatorState.page,
      limit: paginatorState.pageCount,
      offset: paginatorState.first - paginatorState.rows,
    });
  }
}
