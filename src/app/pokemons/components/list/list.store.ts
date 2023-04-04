import { Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import { PaginatedPokemon, Pokemon } from '../../../models/pokemon';
import { BackendService } from '../../../services/backend.service';

interface SetPaginationParams {
  limit: number;
  offset: number;
  currentPage: number;
}

interface ListState extends SetPaginationParams {
  status: string;
  original: Pokemon[];
  fitlered: Pokemon[];
  query: string;
  total: number;
}

const listInitialState: ListState = {
  status: 'idle',
  offset: 0,
  currentPage: 1,
  limit: 20,
  total: 0,
  query: '',
  original: [],
  fitlered: [],
};

@Injectable()
export class ListStore extends ComponentStore<ListState> {
  constructor(private backend: BackendService) {
    super(listInitialState);
  }

  readonly vm$ = this.select(
    this.state$,
    ({ status, fitlered, total, limit, currentPage }) => ({
      isLoading: status === 'loading',
      isIdle: status === 'idle',
      pokemons: fitlered as Pokemon[],
      total,
      limit,
      currentPage,
    }),
    { debounce: true }
  );

  readonly initEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        console.log('Init effect');
        this.fetchPokemonsEffect(this.fetchTrigger$);
        this.filterEffect(this.select((s) => s.query));
      })
    )
  );

  readonly fetchTrigger$ = this.select(
    this.select((s) => s.limit),
    this.select((s) => s.offset),
    (limit, offset) => ({ limit, offset }),
    { debounce: true }
  );

  readonly fetchPokemonsEffect = this.effect<{ limit: number; offset: number }>(
    (pagination$) =>
      pagination$.pipe(
        tap(() => {
          this.patchState({ status: 'loading' });
        }),
        switchMap(({ limit, offset }) =>
          this.backend.getPokemons(limit, offset).pipe(
            tapResponse<PaginatedPokemon>((reponse) => {
              this.patchState({
                original: reponse.results,
                fitlered: reponse.results,
                total: reponse.count,
                status: 'idle',
              });
            }, console.error)
          )
        )
      )
  );

  readonly setPagination = this.updater<SetPaginationParams>(
    (state, { limit, offset, currentPage }) => ({
      ...state,
      limit,
      offset,
      currentPage,
    })
  );

  readonly setQuery = this.updater<string>((state, query) => ({
    ...state,
    query,
  }));

  readonly filterEffect = this.effect<string>((query$) =>
    query$.pipe(
      withLatestFrom(this.select((s) => s.original)),
      tap(([query, original]) => {
        this.patchState({
          fitlered: query
            ? original.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase())
              )
            : original,
        });
      })
    )
  );
}
