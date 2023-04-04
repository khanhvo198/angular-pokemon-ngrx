import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { User } from '../../models/user';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'navbar',
  template: `
    
      <nav>
        <h4>Angular Vietnam v{{ version }}</h4>
        <ng-container *ngIf="(vm$ | async) as vm">
        <button *ngIf="vm.isLoggedIn; else notLoggedIn" (click)="logOut()">
          I am {{ vm.user?.name }}, and I like {{ vm.user?.likes }} and dislike
          {{ vm.user?.dislikes }} pokemons / Log Out
        </button>
        </ng-container>
        <ng-template #notLoggedIn>
          <button (click)="logIn()">Log In</button>
        </ng-template>
        
      </nav>
    
  `,
  styles: [
    `
      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: hotpink;
        color: white;
      }

      h4 {
        margin: 0;
        font-size: 2rem;
      }

      button {
        background: transparent;
        outline: none;
        border: 1px solid;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        font-family: 'Source Sans Pro';
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  version = VERSION.full;
  vm$ = this.authStore.vm$;
  constructor(private authStore: AuthStore) {}

  logIn() {
    // TODO: Please replace with a service call
    this.authStore.loginEffect();
  }

  logOut() {
    // TODO: Please replace with a service call
    this.authStore.logoutEffect();
  }
}
