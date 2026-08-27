import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component';
import { getCommunityPageRoute } from '../community-page-routing-paths';

import { HttpClient} from '@angular/common/http';

/**
 * Component that represents the page where a user can edit an existing Community
 */
@Component({
  selector: 'ds-edit-community',
  templateUrl: '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component.html'
})
export class EditCommunityPageComponent extends EditComColPageComponent<Community> {
  type = 'community';

  public constructor(
    protected http: HttpClient,    
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(http, router, route);
  }

  /**
   * Get the community page url
   * @param community The community for which the url is requested
   */
  getPageUrl(community: Community): string {
    return getCommunityPageRoute(community.id);
  }
}
