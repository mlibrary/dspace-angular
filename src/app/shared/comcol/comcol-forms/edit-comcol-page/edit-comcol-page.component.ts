import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotEmpty } from '../../../empty.util';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { HttpClient} from '@angular/common/http';
import { Collection } from '../../../../core/shared/collection.model';

import { ChangeDetectorRef } from '@angular/core';

// UM Used for global config paramter - location of backend.
import { environment } from '../../../../../environments/environment';

/**
 * Component representing the edit page for communities and collections
 */
@Component({
  selector: 'ds-edit-comcol',
  template: ''
})
export class EditComColPageComponent<TDomain extends DSpaceObject> implements OnInit {

  // public subscribeStats$: Promise<Boolean>;

  subscribeStats: Boolean;
  showContent: boolean;


cd: ChangeDetectorRef;

  /**
   * The type of DSpaceObject (used to create i18n messages)
   */
  public type: string;
  public id: string;

  /**
   * The current page outlet string
   */
  public currentPage: string;

  /**
   * All possible page outlet strings
   */
  public pages: string[];

  /**
   * The DSO to render the edit page for
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  public count: number;

  private serverLocation = environment.serverLocation;

  /**
   * Hide the default return button?
   */
  public hideReturnButton: boolean;

  public constructor(
    protected http: HttpClient,    
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    this.router.events.subscribe(() => this.initPageParamsByRoute());
    this.count = 0;
  }

  ngOnInit(): void {

    this.initPageParamsByRoute();

    this.pages = this.route.routeConfig.children
      .map((child: any) => child.path)
      .filter((path: string) => isNotEmpty(path)); // ignore reroutes

    this.dsoRD$ = this.route.data.pipe(map((data) => data.dso));

    this.dsoRD$.subscribe((value: any) => {
      let id = value.payload.uuid;
      this.type = value.payload.type;
    
      this.http.get(this.serverLocation + '/api/eperson/groups/issubscribed_admin/' + id, {responseType: 'text'}).subscribe((data: any) => {
        if ( data === "true")
        {
          this.subscribeStats = true;
        }
        else {
          this.subscribeStats = false;
        }
      });
    });
  }

  public goToCollectionAdminStats(id: string) {
     var link = document.createElement('a');
     var working_href = 'https://angular.io/guide/router?restrict=1' + 'collid=' + id;
     link.href = working_href;
     link.click();
  }

  public subscribeToAdminStats(id: string) {
    this.http.get(this.serverLocation + '/api/eperson/groups/subscribe_admin/' + id, {responseType: 'text'}).subscribe((data: any) => {
    });

    this.subscribeStats = true;
  }

  public unsubscribeToAdminStats(id: string) {
    this.http.get(this.serverLocation + '/api/eperson/groups/unsubscribe_admin/' + id, {responseType: 'text'}).subscribe((data: any) => {
    });

    this.subscribeStats = false;
  }

  /**
   * Get the dso's page url
   * This method is expected to be overridden in the edit community/collection page components
   * @param dso The DSpaceObject for which the url is requested
   */
  getPageUrl(dso: TDomain): string {
    return this.router.url;
  }

  /**
   * Set page params depending on the route
   */
  initPageParamsByRoute() {
    this.currentPage = this.route.snapshot.firstChild.routeConfig.path;
    this.hideReturnButton = this.route.routeConfig.children
      .find((child: any) => child.path === this.currentPage).data.hideReturnButton;
  }
}
