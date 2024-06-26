import {
  BehaviorSubject,
  Observable,
  of as observableOf,
} from 'rxjs';

import { ViewMode } from '../../core/shared/view-mode.model';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { SearchFilterConfig } from '../search/models/search-filter-config.model';

export class SearchServiceStub {

  private _viewMode: ViewMode;
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testViewMode);

  viewMode = this.subject.asObservable();

  constructor(private searchLink: string = '/search') {
    this.setViewMode(ViewMode.ListElement);
  }

  getViewMode(): Observable<ViewMode> {
    return this.viewMode;
  }

  setViewMode(viewMode: ViewMode) {
    this.testViewMode = viewMode;
  }

  getFacetValuesFor(_filterConfig: SearchFilterConfig, _valuePage: number, _searchOptions?: PaginatedSearchOptions, _filterQuery?: string, _useCachedVersionIfAvailable = true) {
    return null;
  }

  get testViewMode(): ViewMode {
    return this._viewMode;
  }

  set testViewMode(viewMode: ViewMode) {
    this._viewMode = viewMode;
    this.subject.next(viewMode);
  }

  getSearchLink() {
    return this.searchLink;
  }

  getFilterLabels() {
    return observableOf([]);
  }

  search() {
    return observableOf({});
  }
}
