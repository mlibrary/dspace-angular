import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { ExternalScriptLoaderDimensionsService } from 'src/app/shared/utils/scripts-loader-dimensions/external-script-loader-dimensions.service';
import {
  ExternalScriptsNames,
  ExternalScriptsStatus,
} from 'src/app/shared/utils/scripts-loader-dimensions/external-script.model';
import { Item } from '../../../../../../core/shared/item.model';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Component({
  selector: 'ds-item-page-dimensions-field',
  templateUrl: './item-page-dimensions-field.component.html',
})
export class ItemPageDimensionsFieldComponent implements AfterViewInit {
  @Input() item: Item;

  @Output() widgetLoaded = new EventEmitter<boolean>();

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private scriptLoader: ExternalScriptLoaderDimensionsService
  ) {}

  ngAfterViewInit() {
    if (!this.appConfig.item.showAltmetricBadge) {
      return;
    }
    this.scriptLoader
      .load(ExternalScriptsNames.DIMENSIONS)
      .then((data) => this.reloadBadge(data))
      .catch((error) => console.error(error));
  }

  /**
   * We ensure that the badge is visible after the script is loaded
   * @param data The data returned from the promise
   */
  // private reloadBadge(data: any[]) {
  //   if (data.find((element) => this.isLoaded(element))) {
  //     const initMethod = '__dimensions_embed_installed__';
  //     window[initMethod]();
  //   }
  // }

  //  I got this method from the community.  The init method has to be different.
  private reloadBadge(data: any[]) {
    if (data.find((element) => this.isLoaded(element))) {
      const initClass = '__dimensions_embed';
      const initMethod = 'addBadges';
      window[initClass][initMethod]();
    }
  }


  /**
   * Check if the script has been previously loaded in the DOM
   * @param element The resolve element from the promise
   * @returns true if the script has been already loaded, false if not
   */
  private isLoaded(element: any): unknown {
    return (
      element.script === ExternalScriptsNames.DIMENSIONS &&
      element.status === ExternalScriptsStatus.ALREADY_LOADED
    );
  }

  @HostListener('window:altmetric:show', ['$event'])
  private onWidgetShow(event: Event) {
    this.widgetLoaded.emit(true);
  }
}
