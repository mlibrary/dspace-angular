import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import {
  CHANGE_APPLIED_FILTERS,
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SCOPE,
} from '../../../../../core/shared/search/search-filter.service';
import { AppliedFilter } from '../../../models/applied-filter.model';
import { FilterType } from '../../../models/filter-type.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { renderFilterType } from '../search-filter-type-decorator';

@Component({
  selector: 'ds-search-facet-filter-wrapper',
  templateUrl: './search-facet-filter-wrapper.component.html',
  standalone: true,
  imports: [NgComponentOutlet],
})

/**
 * Wrapper component that renders a specific facet filter based on the filter config's type
 */
export class SearchFacetFilterWrapperComponent implements OnInit {
  /**
   * Configuration for the filter of this wrapper component
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * The current scope
   */
  @Input() scope: string;

  /**
   * Emits the {@link AppliedFilter}s of this search filter
   */
  @Output() changeAppliedFilters: EventEmitter<AppliedFilter[]> = new EventEmitter();

  /**
   * The constructor of the search facet filter that should be rendered, based on the filter config's type
   */
  searchFilter: GenericConstructor<SearchFacetFilterComponent>;
  /**
   * Injector to inject a child component with the @Input parameters
   */
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  /**
   * Initialize and add the filter config to the injector
   */
  ngOnInit(): void {
    this.searchFilter = this.getSearchFilter();
    this.objectInjector = Injector.create({
      providers: [
        { provide: FILTER_CONFIG, useFactory: () => (this.filterConfig), deps: [] },
        { provide: IN_PLACE_SEARCH, useFactory: () => (this.inPlaceSearch), deps: [] },
        { provide: REFRESH_FILTER, useFactory: () => (this.refreshFilters), deps: [] },
        { provide: SCOPE, useFactory: () => (this.scope), deps: [] },
        { provide: CHANGE_APPLIED_FILTERS, useFactory: () => this.changeAppliedFilters },
      ],
      parent: this.injector,
    });
  }

  /**
   * Find the correct component based on the filter config's type
   */
  private getSearchFilter() {
    const type: FilterType = this.filterConfig.filterType;
    return renderFilterType(type);
  }
}
