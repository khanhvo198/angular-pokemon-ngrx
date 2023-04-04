import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { map, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthStore } from '../stores/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard
  implements CanLoad, CanActivate, CanActivateChild
{
  constructor(private readonly router: Router, private authStore: AuthStore) {}

  canLoad() {
    return this.isAuth$();
  }

  canActivate() {
    return this.isAuth$();
  }

  canActivateChild() {
    return this.isAuth$();
  }

  private isAuth$() {
    return this.authStore.vm$.pipe(map(({ isLoggedIn }) => isLoggedIn));
  }
}
