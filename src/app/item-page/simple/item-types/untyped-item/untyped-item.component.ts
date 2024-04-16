import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';

import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { Observable, of as observableOf } from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';
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

  private sanitizer = inject(DomSanitizer);
  trustedUrl: any = '';
  theDoi: any = '10.1002/jbmr.493';

  ngOnInit() {

    //this.hasLink = isNotEmpty(this.item.href);
    let node = document.createElement('script'); 
    node.src = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js';
    node.type = 'text/javascript';
    node.id = 'cloudflarescript';
    document.getElementsByTagName('head')[0].appendChild(node);


    let node2 = document.createElement('script'); 
    node2.src = 'https://badge.dimensions.ai/badge.js';
    node2.type = 'text/javascript';
    node2.id = 'cloudflarescript2';
    document.getElementsByTagName('head')[0].appendChild(node2);

//  let check3 = document.querySelector("link[href='https://badge.dimensions.ai/badge.css']");
//  if ( check3 )
//  {
//    console.log ('ngOnDestroy removing link to dimensions');
//    check3.remove();
//  } 

}


ngOnDestroy() {
  let check2 = document.getElementById('cloudflarescript2');
  if ( check2 )
  {
    //console.log ('ngOnDestroy removing');
    check2.remove();
  } 

  let check = document.getElementById('cloudflarescript');
  if ( check )
  {
    //console.log ('ngOnDestroy removing');
    check.remove();
  }

// let check3 = document.querySelector("link[href='https://badge.dimensions.ai/badge.css']");
// if ( check3 )
// {
//   console.log ('ngOnDestroy removing link to dimensions');
//   check3.remove();
// } 

}

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

  public getParent(value: String): String {

    //value ="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/33084471/partner_id/1038472?autoembed=true&entry_id=1_irztzumh&playerId=kaltura_player_01&cache_st=1455309475&width=400&height=330&flashvars[streamerType]=auto=";
    const matches = value.match(/https:\/\/cdnapisec\.kaltura\.com\/p\/(\w+)\//);
    if (matches) {
      // console.log(matches[1]); // ordem1    
    }
    return matches[1];
  }

  public getSubParent(value: String): String {

    //value ="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/33084471/partner_id/1038472?autoembed=true&entry_id=1_irztzumh&playerId=kaltura_player_01&cache_st=1455309475&width=400&height=330&flashvars[streamerType]=auto=";
    const matches = value.match(/https:\/\/cdnapisec\.kaltura\.com\/p\/.*?\/sp\/(\w+)\//);
    if (matches) {
      // console.log(matches[1]); // ordem1    
    }
    return matches[1];
  }

  public getUiConf(value: String): String {

    //value ="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/33084471/partner_id/1038472?autoembed=true&entry_id=1_irztzumh&playerId=kaltura_player_01&cache_st=1455309475&width=400&height=330&flashvars[streamerType]=auto=";
    const matches = value.match(/.*?\/uiconf_id\/(\w+)\//);
    if (matches) {
      //  console.log(matches[1]); // ordem1    
    }
    return matches[1];
  }

  public getEntryId(value: String): String {
    //value ="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/33084471/partner_id/1038472?autoembed=true&entry_id=1_irztzumh&playerId=kaltura_player_01&cache_st=1455309475&width=400&height=330&flashvars[streamerType]=auto=";
    const matches = value.match(/.*?entry_id=(\w+)\&/);
    if (matches) {
      // console.log(matches[1]); // ordem1    
    }
    return matches[1];
  }

  // Explains how to do this.
  //https://www.google.com/search?q=iframe+angular&sca_esv=3acf9be9fedf7d41&sca_upv=1&rlz=1C5GCEM_enUS944US945&ei=hw8UZp7gBIG4wN4P4q-F0A0&ved=0ahUKEwjev7vP-bKFAxUBHNAFHeJXAdoQ4dUDCBE&uact=5&oq=iframe+angular&gs_lp=Egxnd3Mtd2l6LXNlcnAiDmlmcmFtZSBhbmd1bGFyMgsQABiABBiKBRiRAjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeSIYrUIkMWMgmcAF4AJABAJgBeKAB9gmqAQQxMS40uAEDyAEA-AEBmAIPoALzCcICChAAGEcY1gQYsAPCAg4QABiABBiKBRixAxiDAcICCxAAGIAEGLEDGIMBwgIOEC4YgAQYigUYsQMYgwHCAhEQLhiABBixAxiDARjHARjRA8ICCxAuGIMBGLEDGIAEwgIOEC4YgAQYsQMYxwEY0QPCAgUQLhiABMICCxAuGIAEGMcBGK8BwgIOEAAYgAQYigUYkQIYsQPCAgoQABiABBiKBRhDwgINEAAYgAQYigUYQxixA8ICCBAAGIAEGLEDmAMAiAYBkAYIkgcEMTEuNKAHsWU&sclient=gws-wiz-serp#fpstate=ive&vld=cid:a23e759d,vid:VCJ45dH0aOs,st:0
  public getVideoUrl(value: String) {
    let url = "https://cdnapisec.kaltura.com/p/" + this.getParent(value) + "/sp/" + this.getSubParent(value) + "/embedIframeJs/uiconf_id/" + this.getUiConf(value) + "/partner_id/" + this.getParent(value) + "?iframeembed=true&playerId=kaltura_player_1712258806&entry_id=" + this.getEntryId(value);
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //  This is used for the altmetrics and dimensions icon.
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
