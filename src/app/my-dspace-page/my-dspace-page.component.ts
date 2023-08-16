import { ChangeDetectionStrategy, Component, Inject, InjectionToken, OnInit } from '@angular/core';

import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SearchService } from '../core/shared/search/search.service';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { ViewMode } from '../core/shared/view-mode.model';
import { MyDSpaceRequest } from '../core/data/request.models';
import { Context } from '../core/shared/context.model';
import { RoleType } from '../core/roles/role-types';

export const MYDSPACE_ROUTE = '/mydspace';
export const SEARCH_CONFIG_SERVICE: InjectionToken<SearchConfigurationService> = new InjectionToken<SearchConfigurationService>('searchConfigurationService');

/**
 * This component represents the whole mydspace page
 */
@Component({
  selector: 'ds-my-dspace-page',
  styleUrls: ['./my-dspace-page.component.scss'],
  templateUrl: './my-dspace-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: MyDSpaceConfigurationService
    }
  ]
})
export class MyDSpacePageComponent implements OnInit {

  subscribeStats: Boolean;

  /**
   * The list of available configuration options
   */
  configurationList$: Observable<SearchConfigurationOption[]>;

  /**
   * The start context to use in the search: workspace or workflow
   */
  context: Context;

  /**
   * The start configuration to use in the search: workspace or workflow
   */
  configuration: string;

  /**
   * Variable for enumeration RoleType
   */
  roleTypeEnum = RoleType;

  /**
   * List of available view mode
   */
  viewModeList = [ViewMode.ListElement, ViewMode.DetailedListElement];

  constructor(private service: SearchService,
    private http: HttpClient,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: MyDSpaceConfigurationService) {
    this.service.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  /**
   * Initialize available configuration list
   *
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   *
   * Listen to changes in the configuration
   * If something changes, update the current context
   */
  ngOnInit(): void {
    this.configurationList$ = this.searchConfigService.getAvailableConfigurationOptions();

    this.configurationList$.pipe(take(1)).subscribe((configurationList: SearchConfigurationOption[]) => {
      this.configuration = configurationList[0].value;
      this.context = configurationList[0].context;
    });

    this.http.get('http://localhost:8080/server/api/eperson/groups/issubscribed', {responseType: 'text'}).subscribe((data: any) => {
      this.subscribeStats = false;
      if ( data === "true")
      {
        this.subscribeStats = true;
      }
    });

  }

  public subscribeToDepositStats() {
    this.http.get('http://localhost:8080/server/api/eperson/groups/subscribe', {responseType: 'text'}).subscribe((data: any) => {
     });
    this.subscribeStats = true;
  }

  public unsubscribeToDepositStats() {
    this.http.get('http://localhost:8080/server/api/eperson/groups/unsubscribe', {responseType: 'text'}).subscribe((data: any) => {
    });
    this.subscribeStats = false;
  }

}
