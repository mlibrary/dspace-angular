import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';

import { Router, NavigationEnd  } from '@angular/router';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
})
export class HeaderComponent extends BaseComponent {

skipLinkPath: string;
  private routerSubscription: Subscription;

  constructor(
    router: Router,
    menuService: MenuService
  ) {
    super(router, menuService);
  }

  ngOnInit() {
    this.setSkipLinkPath();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setSkipLinkPath();
      });
  }

  private setSkipLinkPath() {
    const fragment = '#maincontent';
    const urlWithoutFragment = this.router.url.split('#')[0];
    this.skipLinkPath = this.router.url.includes(fragment)
      ? this.router.url
      : `${urlWithoutFragment}${fragment}`;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
