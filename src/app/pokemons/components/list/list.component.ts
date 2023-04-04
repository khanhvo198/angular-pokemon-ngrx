import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import type { PaginatorState } from '../../../components/paginator/paginator.component';

@Component({
  selector: 'pokemon-list',
  template: `
    <paginator
      [currentPage]="1"
      [rowsPerPageOptions]="[10, 20, 40, 80]"
      [rows]="20"
      [totalRecords]="100"
      (onPageChange)="onPageChanged($event)"
    ></paginator>
    <input
      type="text"
      class="w-2/4 p-2 rounded border border-gray-600"
      placeholder="Filter by pokemon name..."
      [formControl]="query"
    />
    <data-table [isLoading]="false" [data]="[]"></data-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  query = new FormControl('');

  onPageChanged(paginatorState: PaginatorState) {
    console.log(paginatorState);
  }
}
