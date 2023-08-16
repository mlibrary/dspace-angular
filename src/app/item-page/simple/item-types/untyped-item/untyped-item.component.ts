import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';

import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { Observable, of as observableOf } from 'rxjs';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends ItemComponent {



  public getSelectedCcLicense(ccLicense: String): String {
    if ( ccLicense.startsWith("http://creativecommons.org/licenses/by/") )
    {
      return '../../../../assets/images/cc_licenses/cc-by.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/licenses/by-sa/") )
    {
      return '../../../../assets/images/cc_licenses/cc-by-sa.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/licenses/by-nd/") )
    {
      return '../../../../assets/images/cc_licenses/cc-by-nd.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/licenses/by-nc/") )
    {
      return '../../../../assets/images/cc_licenses/cc-by-nc.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/licenses/by-nc-sa/") )
    {
      return '../../../../assets/images/cc_licenses/cc-by-nc-sa.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/licenses/by-nc-nd/") )
    {
      return '../../../../assets/images/cc_licenses/cc-by-nc-nd.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/publicdomain/zero/") )
    {
      return '../../../../assets/images/cc_licenses/cc-zero.png';
    } else if ( ccLicense.startsWith("http://creativecommons.org/publicdomain/mark/") )
    {
      return '../../../../assets/images/cc_licenses/cc-mark.png';
    } else
    {
      return '../../../../assets/images/cc_licenses/cc-generic.png';
    }
  }

  public getHandle(values: String[]): String {
  for(var index in values)
    { 
      if (values[index].includes("https://hdl.handle.net/") ){
        return  values[index].replace("https://hdl.handle.net/", "");
      }
    }
  }

  public getDoi(doi: String): String {
    doi.replace("http://dx.doi.org/", "");
    doi.replace("https://dx.doi.org/", "");
   return doi;
  }

  // public isAdmin(): Boolean {

  //   let authorizationService: AuthorizationDataService;
  //   return  authorizationService.isAuthorized(FeatureID.CanSendFeedback);
  //   //return false;
  // }

}
