import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import {
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../../../core/shared/operators';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import {
  CHANGE_APPLIED_FILTERS,
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SCOPE,
  SearchFilterService,
} from '../../../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../../../../empty.util';
import { InputSuggestion } from '../../../../input-suggestions/input-suggestions.model';
import { EmphasizePipe } from '../../../../utils/emphasize.pipe';
import { currentPath } from '../../../../utils/route.utils';
import { AppliedFilter } from '../../../models/applied-filter.model';
import { FacetValue } from '../../../models/facet-value.model';
import { FacetValues } from '../../../models/facet-values.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { SearchOptions } from '../../../models/search-options.model';
import {
  addOperatorToFilterValue,
  getFacetValueForType,
  stripOperatorFromFilterValue,
} from '../../../search.utils';

@Component({
  selector: 'ds-search-facet-filter',
  template: ``,
  standalone: true,
})

/**
 * Super class for all different representations of facets
 */
export class SearchFacetFilterComponent implements OnInit, OnDestroy {
  /**
   * Emits an array of pages with values found for this facet
   */
  facetValues$: BehaviorSubject<FacetValues[]> = new BehaviorSubject([]);

  /**
   * Emits the current last shown page of this facet's values
   */
  currentPage: Observable<number>;

  /**
   * Emits true if the current page is also the last page available
   */
  isLastPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * The value of the input field that is used to query for possible values for this filter
   */
  filter: string;

  /**
   * List of subscriptions to unsubscribe from
   */
  protected subs: Subscription[] = [];

  /**
   * Emits the result values for this filter found by the current filter query
   */
  filterSearchResults: Observable<InputSuggestion[]> = observableOf([]);

  /**
   * Emits the active values for this filter
   */
  selectedAppliedFilters$: Observable<AppliedFilter[]>;

  protected collapseNextUpdate = true;

  /**
   * State of the requested facets used to time the animation
   */
  animationState = 'loading';

  /**
   * Emits all current search options available in the search URL
   */
  searchOptions$: Observable<SearchOptions>;

  /**
   * The current URL
   */
  currentUrl: string;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected rdbs: RemoteDataBuildService,
              protected router: Router,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
              @Inject(REFRESH_FILTER) public refreshFilters: BehaviorSubject<boolean>,
              @Inject(SCOPE) public scope: string,
              @Inject(CHANGE_APPLIED_FILTERS) public changeAppliedFilters: EventEmitter<AppliedFilter[]>,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.currentPage = this.getCurrentPage().pipe(distinctUntilChanged());
    this.searchOptions$ = this.searchConfigService.searchOptions.pipe(
      map((options: SearchOptions) => hasNoValue(this.scope) ? options : Object.assign({}, options, {
        scope: this.scope,
      })),
    );
    this.subs.push(
      this.searchOptions$.subscribe(() => this.updateFilterValueList()),
      this.refreshFilters.asObservable().pipe(
        filter((toRefresh: boolean) => toRefresh),
        // NOTE This is a workaround, otherwise retrieving filter values returns tha old cached response
        debounceTime((100)),
        mergeMap(() => this.retrieveFilterValues(false)),
      ).subscribe(),
    );
    this.retrieveFilterValues().subscribe();
  }

  /**
   * Prepare for refreshing the values of this filter
   */
  updateFilterValueList() {
    this.animationState = 'loading';
    this.collapseNextUpdate = true;
    this.filter = '';
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  /**
   * Show the next page as well
   */
  showMore() {
    this.filterService.incrementPage(this.filterConfig.name);
  }

  /**
   * Make sure only the first page is shown
   */
  showFirstPageOnly() {
    this.filterService.resetPage(this.filterConfig.name);
  }

  /**
   * @returns {Observable<number>} The current page of this filter
   */
  getCurrentPage(): Observable<number> {
    return this.filterService.getPage(this.filterConfig.name);
  }

  /**
   * Submits a new active custom value to the filter from the input field when the input field isn't empty.
   * @param data The string from the input field
   */
  onSubmit(data: any) {
    this.applyFilterValue(data);
  }

  /**
   * Submits a selected filter value to the filter
   * Take the query from the InputSuggestion object
   * @param data The input suggestion selected
   */
  onClick(data: InputSuggestion) {
    this.applyFilterValue(data.query);
  }

  /**
   * For usage of the hasValue function in the template
   */
  hasValue(o: any): boolean {
    return hasValue(o);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Updates the found facet value suggestions for a given query
   * Transforms the found values into display values
   * @param data The query for which is being searched
   */
  findSuggestions(data): void {
    if (isNotEmpty(data)) {
      this.searchOptions$.pipe(take(1)).subscribe(
        (options) => {
          this.filterSearchResults = this.searchService.getFacetValuesFor(this.filterConfig, 1, options, data.toLowerCase())
            .pipe(
              getFirstSucceededRemoteData(),
              map(
                (rd: RemoteData<PaginatedList<FacetValue>>) => {
                  return rd.payload.page.map((facet) => {
                    return {
                      displayValue: this.getDisplayValue(facet, data),
                      query: this.getFacetValue(facet),
                      value: stripOperatorFromFilterValue(this.getFacetValue(facet)),
                    };
                  });
                },
              ));
        },
      );
    } else {
      this.filterSearchResults = observableOf([]);
    }
  }

  /**
   * Build the filter query using the value given and apply to the search.
   * @param data The string from the input field
   */
  protected applyFilterValue(data) {
    if (data.match(new RegExp(`^.+,(equals|query|authority)$`))) {
      this.selectedAppliedFilters$.pipe(take(1)).subscribe((selectedValues: AppliedFilter[]) => {
        if (isNotEmpty(data)) {
          void this.router.navigate(this.getSearchLinkParts(), {
            queryParams:
              {
                [this.filterConfig.paramName]: [
                  ...selectedValues.map((appliedFilter: AppliedFilter) => addOperatorToFilterValue(appliedFilter.value, appliedFilter.operator)),
                  data,
                ],
              },
            queryParamsHandling: 'merge',
          });
          this.filter = '';
        }
        this.filterSearchResults = observableOf([]);
      });
    }
  }

  /**
   * Retrieve facet value
   */
  protected getFacetValue(facet: FacetValue): string {
    return getFacetValueForType(facet, this.filterConfig);
  }

  protected retrieveFilterValues(useCachedVersionIfAvailable = true): Observable<FacetValues[]> {
    return observableCombineLatest([this.searchOptions$, this.currentPage]).pipe(
      switchMap(([options, page]: [SearchOptions, number]) => this.searchService.getFacetValuesFor(this.filterConfig, page, options, null, useCachedVersionIfAvailable).pipe(
        getFirstSucceededRemoteDataPayload(),
        tap((facetValues: FacetValues) => {
          this.isLastPage$.next(hasNoValue(facetValues?.next));
        }),
      )),
      map((newFacetValues: FacetValues) => {
        let filterValues: FacetValues[] = this.facetValues$.value;

        if (this.collapseNextUpdate) {
          this.showFirstPageOnly();
          filterValues = [];
          this.collapseNextUpdate = false;
        }
        if (newFacetValues.pageInfo.currentPage === 1) {
          filterValues = [];
        }

        filterValues = [...filterValues, newFacetValues];

        return filterValues;
      }),
      tap((allFacetValues: FacetValues[]) => {
        this.setAppliedFilter(allFacetValues);
        this.animationState = 'ready';
        this.facetValues$.next(allFacetValues);
      }),
    );
  }

  setAppliedFilter(allFacetValues: FacetValues[]): void {
    const allAppliedFilters: AppliedFilter[] = [].concat(...allFacetValues.map((facetValues: FacetValues) => facetValues.appliedFilters))
      .filter((appliedFilter: AppliedFilter) => hasValue(appliedFilter));

    this.selectedAppliedFilters$ = this.filterService.getSelectedValuesForFilter(this.filterConfig).pipe(
      map((selectedValues: string[]) => {
        const appliedFilters: AppliedFilter[] = selectedValues.map((value: string) => {
          return allAppliedFilters.find((appliedFilter: AppliedFilter) => appliedFilter.value === stripOperatorFromFilterValue(value));
        }).filter((appliedFilter: AppliedFilter) => hasValue(appliedFilter));
        this.changeAppliedFilters.emit(appliedFilters);
        return appliedFilters;
      }),
    );
  }

  /**
   * Transforms the facet value string, so if the query matches part of the value, it's emphasized in the value
   * @param {FacetValue} facet The value of the facet as returned by the server
   * @param {string} query The query that was used to search facet values
   * @returns {string} The facet value with the query part emphasized
   */
  getDisplayValue(facet: FacetValue, query: string): string {
    return new EmphasizePipe().transform(facet.value, query) + ' (' + facet.count + ')';
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, value: FacetValue) {
    return value ? value._links.search.href : undefined;
  }
}

export const facetLoad = trigger('facetLoad', [
  state('ready', style({ opacity: 1 })),
  state('loading', style({ opacity: 0 })),
  transition('loading <=> ready', animate(100)),
]);
