import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component';
import { Collection } from '../../core/shared/collection.model';
import { getCollectionPageRoute } from '../collection-page-routing-paths';

import { HttpClient} from '@angular/common/http';

/**
 * Component that represents the page where a user can edit an existing Collection
 */
@Component({
  selector: 'ds-edit-collection',
  templateUrl: '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component.html'
})
export class EditCollectionPageComponent extends EditComColPageComponent<Collection> {
  type = 'collection';

  public constructor(
    protected http: HttpClient,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(http, router, route);
  }

  /**
   * Get the collection page url
   * @param collection The collection for which the url is requested
   */
  getPageUrl(collection: Collection): string {
    return getCollectionPageRoute(collection.id);
  }
}
