import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { map, of, tap } from 'rxjs';
import { User } from '../models/user';

interface AuthState {
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  readonly user$ = this.select((s) => s.user);
  readonly vm$ = this.select(({ user }) => ({ user, isLoggedIn: !!user }));

  constructor(private router: Router) {
    super({ user: null });
    this.initializeEffect();
    this.saveUserEffect(this.user$);
  }

  readonly initializeEffect = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => {
        const currentUser = JSON.parse(
          localStorage.getItem('demo-user')
        ) as User;
        if (currentUser) {
          this.patchState({ user: currentUser });
        }
      })
    );
  });

  readonly loginEffect = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => {
        this.patchState({
          user: {
            name: 'MyStic',
            likes: 0,
            dislikes: 0,
          },
        });
        this.router.navigate(['/']);
      })
    );
  });

  readonly logoutEffect = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => {
        this.patchState({
          user: null,
        });
        this.router.navigate(['/not-auth']);
      })
    );
  });

  readonly saveUserEffect = this.effect<User>((user$) => {
    console.log('Save User effect Run');
    return user$.pipe(
      tap((user) => {
        if (user === null) {
          localStorage.removeItem('demo-user');
        } else {
          localStorage.setItem('demo-user', JSON.stringify(user));
        }
      })
    );
  });

  readonly incrementLikes = this.updater((state) => {
    return {
      ...state,
      user: { ...state.user, likes: state.user.likes + 1 },
    };
  });

  readonly incrementDislikes = this.updater((state) => {
    return {
      ...state,
      user: { ...state.user, dislikes: state.user.dislikes + 1 },
    };
  });
}
