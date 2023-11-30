import { Component, Inject, OnInit } from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { TruncatableService } from '../../../../../truncatable/truncatable.service';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../../../config/app-config.interface';
import { BitstreamDataService } from '../../../../../../core/data/bitstream-data.service';


@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item>  {

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  constructor(protected truncatableService: TruncatableService,
              public dsoNameService: DSONameService,
              public bitstreamDataService: BitstreamDataService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    this.itemPageRoute = getItemPageRoute(this.dso);
  }
}
