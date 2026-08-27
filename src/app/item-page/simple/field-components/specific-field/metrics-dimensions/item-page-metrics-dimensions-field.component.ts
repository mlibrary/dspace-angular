import { Component, Input } from '@angular/core';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-item-page-metrics-dimensions-field',
  templateUrl: './item-page-metrics-dimensions-field.component.html',
  styleUrls: [
    '../../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component.scss',
  ],
})
export class ItemPageMetricsDimensionsFieldComponent extends ItemPageFieldComponent {

  @Input() item: Item;

  public showTitle = false;

  public someWidgetHasLoaded(widgetLoaded: boolean) {
    if (widgetLoaded) {
      this.showTitle = true;
    }
  }

}
