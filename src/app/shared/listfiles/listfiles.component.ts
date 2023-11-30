import { Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';

import { RemoteData } from '../../core/data/remote-data';
import { hasValue } from '../../shared/empty.util';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';


import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import {      
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../core/shared/operators';


@Component({
  selector: 'ds-listfiles',
  templateUrl: './listfiles.component.html'
})

export class ListfilesComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.files';

  #separator = '<br/>';

  separator = '  ';

  bitstreams$: BehaviorSubject<Bitstream[]>;

  currentPage: number;

  isLoading: boolean;

  isLastPage: boolean;

  pageSize: number;

  //UM Change to support Hidden files.
  formatId: string;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected configService: ConfigurationDataService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    this.pageSize = this.appConfig.item.bitstream.pageSize;
  }

  ngOnInit(): void {

    this.configService.findByPropertyName('hidden.format').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload()
      ).subscribe((remoteData) => {
          if (remoteData === undefined || remoteData.values.length === 0) {
            this.formatId = '12345';
                        console.log ("hidden.format ==>" + this.formatId);
          } else {
            this.formatId = remoteData.values[0];
                        console.log ("hidden.format ==>" + this.formatId);
          }
      })

    this.getNextPageDisplay();
  }

 getIconForFileRestriction(desc: string): string {
    console.log("desc is = " + desc);

      if ( desc == null)
      {
         return ""; 
      }
      else if ( (desc.toLowerCase().includes('restricted to u') ) )
      {
         return "<img alt='Restricted to current U-M faculty, staff, and students' src='/assets/dspace/images/doc_icons/u-m_campus_only_access_icon.png' title='Restricted to current U-M faculty, staff, and students'/>";
      }
      else if ( (desc.toLowerCase().includes('restricted to on-site access at biological station') ) )
      {
         return "<img alt='Restricted to on-site access at Biological Station' src='/assets/dspace/images/doc_icons/u-m_campus_only_access_icon.png' title='Restricted to on-site access at Biological Station'/>";
      }
      else if ( (desc.toLowerCase().includes('restricted to on-site access at bentley historical library') ) )
      {
         return "<img alt='Restricted to on-site access at Bentley Historical Library' src='/assets/dspace/images/doc_icons/u-m_campus_only_access_icon.png' title='Restricted to on-site access at Bentley Historical Library'/>";
      }
      else 
      {
         return "";
      }

  }

  getIconForRequestCopy(desc: string): string {
      if ( desc == null)
      {
         return ""; 
      }
      else 
      {
        return "<img alt='Request Copy' src='/assets/dspace/images/doc_icons/lock.gif' title='Request Copy'/>";
      }
  }

  getNextPageDisplay(): void { 
    console.log("getting bitstreams....");
    this.isLoading = true;
    if (this.currentPage === undefined) {
      this.currentPage = 1;
      this.bitstreams$ = new BehaviorSubject([]);
    } else {
      this.currentPage++;
    }
    this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL', {
      currentPage: this.currentPage,
      elementsPerPage: this.pageSize
    }).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.errorMessage) {
      //  this.notificationsService.error(this.translateService.get('file-section.error.header'), `${bitstreamsRD.statusCode} ${bitstreamsRD.errorMessage}`);
       // return ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>";
      } else if (hasValue(bitstreamsRD.payload)) {
        const current: Bitstream[] = this.bitstreams$.getValue();
        this.bitstreams$.next([...current, ...bitstreamsRD.payload.page]);
        this.isLoading = false;
        this.isLastPage = this.currentPage === bitstreamsRD.payload.totalPages;
      }
    });
  }

}