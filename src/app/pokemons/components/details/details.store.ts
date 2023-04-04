import { Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tapResponse } from '@ngrx/component-store';
import { ComponentStore } from '@ngrx/component-store';
import { map, pluck, switchMap, tap, withLatestFrom } from 'rxjs';
import { SimplifiedPokemon } from '../../../models/pokemon';
import { BackendService } from '../../../services/backend.service';
import { AuthStore } from '../../../stores/auth.store';

interface DetailState {
  pokemonId: number;
  pokemon: SimplifiedPokemon | null;
  status: string;
}

@Injectable()
export class DetailStore extends ComponentStore<DetailState> {
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private router: Router,
    private authStore: AuthStore
  ) {
    super({ pokemonId: 0, pokemon: null, status: 'idle' });
    this.fetchPokemonEffect(this.route.params.pipe(map((params) => params.id)));
  }

  private pokemonId$ = this.select((s) => s.pokemonId);

  readonly vm$ = this.select(
    this.select((s) => s.pokemon),
    this.select((s) => s.status),
    (pokemon, status) => ({ pokemon, isLoading: status === 'loading' }),
    { debounce: true }
  );

  readonly fetchPokemonEffect = this.effect<string>((id$) =>
    id$.pipe(
      tap((id) => {
        this.patchState({
          pokemonId: Number(id),
          pokemon: null,
          status: 'loading',
        });
      }),
      switchMap((id: string) => {
        return this.backend.getPokemonDetail(id).pipe(
          tapResponse(
            (response) =>
              this.patchState({
                pokemon: response,
                status: 'idle',
              }),
            console.error
          )
        );
      })
    )
  );

  readonly nextIdEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.pokemonId$),
      tap(([, id]) => this.router.navigate(['/pokemons', id + 1]))
    )
  );
  readonly prevIdEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.pokemonId$),
      tap(([, id]) => this.router.navigate(['/pokemons', id - 1]))
    )
  );

  readonly likeEffect = this.authStore.incrementLikes;
  readonly dislikeEffect = this.authStore.incrementDislikes;
}
