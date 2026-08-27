import { Injectable } from '@angular/core';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { TranslateService } from '@ngx-translate/core';
import { Metadata } from '../shared/metadata.utils';


/**
 * Returns a name for a {@link DSpaceObject} based
 * on its render types.
 */
@Injectable({
  providedIn: 'root'
})
export class DSONameService {

  constructor(private translateService: TranslateService) {

  }

  /**
   * Functions to generate the specific names.
   *
   * If this list ever expands it will probably be worth it to
   * refactor this using decorators for specific entity types,
   * or perhaps by using a dedicated model for each entity type
   *
   * With only two exceptions those solutions seem overkill for now.
   */
  private readonly factories = {
    EPerson: (dso: DSpaceObject): string => {
      const firstName = dso.firstMetadataValue('eperson.firstname');
      const lastName = dso.firstMetadataValue('eperson.lastname');
      if (isEmpty(firstName) && isEmpty(lastName)) {
        return this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(firstName) || isEmpty(lastName)) {
        return firstName || lastName;
      } else {
        return `${firstName} ${lastName}`;
      }
    },
    Person: (dso: DSpaceObject): string => {
      const familyName = dso.firstMetadataValue('person.familyName');
      const givenName = dso.firstMetadataValue('person.givenName');
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return dso.firstMetadataValue('dc.title') || this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      } else {
        return `${familyName}, ${givenName}`;
      }
    },
    OrgUnit: (dso: DSpaceObject): string => {
      return dso.firstMetadataValue('organization.legalName');
    },
    Default: (dso: DSpaceObject): string => {
      // If object doesn't have dc.title metadata use name property
      return dso.firstMetadataValue('dc.title') || dso.name || this.translateService.instant('dso.name.untitled');
    }
  };

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getName(dso: DSpaceObject | undefined): string {
    if (dso) {
      const types = dso.getRenderTypes();
      const match = types
        .filter((type) => typeof type === 'string')
        .find((type: string) => Object.keys(this.factories).includes(type)) as string;

      let name;
      if (hasValue(match)) {
        name = this.factories[match](dso);
      }
      if (isEmpty(name)) {
        name = this.factories.Default(dso);
      }
      return name;
    } else {
      return '';
    }
  }

  // UM Change
  getIconForFile(dso: DSpaceObject | undefined): string {
    if (dso) {
      const types = dso.getRenderTypes();

      const match = types
        .filter((type) => typeof type === 'string')
        .find((type: string) => Object.keys(this.factories).includes(type)) as string;

      let name;
      if (hasValue(match)) {
        name = this.factories[match](dso);
      }
      if (isEmpty(name)) {
        name = this.factories.Default(dso);
      }

      if ( name.endsWith(".pdf") )
      {
         return "<img alt='PDF file' src='/assets/dspace/images/doc_icons/pdf_icon-18x18.png' title='PDF file'/>";
      }
      else if ( (name.endsWith(".txt") ) || (name.endsWith(".asc") ) )
      {
         return "<img alt='TXT file' src='/assets/dspace/images/doc_icons/text_icon-18x18.png' title='TXT file'/>";
      }
      else if ( (name.endsWith(".doc") ) || (name.endsWith(".docx") ) )
      {
         return "<img alt='MS Word file' src='/assets/dspace/images/doc_icons/word_icon-18x18.png' title='MS Word file'/>";
      } 
      else if ( (name.endsWith(".pptx") ) || (name.endsWith(".ppt") ) )
      {
         return "<img alt='MS Powerpoint file' src='/assets/dspace/images/doc_icons/powerpoint_icon-18x18.png' title='MS Powerpoint file'/>";
      } 
      else if ( (name.endsWith(".xlsx") ) || (name.endsWith(".xls") ) )
      {
         return "<img alt='MS Excel file' src='/assets/dspace/images/doc_icons/excel_icon-18x18.png' title='MS Excel file'/>";
      }
      else if ( (name.endsWith(".jpeg") ) || (name.endsWith(".jpg") ) )
      {
         return "<img alt='JPEG file' src='/assets/dspace/images/doc_icons/jpeg_icon-18x18.png' title='JPEG file'/>";
      }
      else if ( (name.endsWith(".tiff") ) || (name.endsWith(".tif") ) )
      {
         return "<img alt='TIFF file' src='/assets/dspace/images/doc_icons/tiff_icon-18x18.png' title='TIFF file'/>";
      }
      else if ( (name.endsWith(".gif") ) || (name.endsWith(".png") ) || (name.endsWith(".jp2") ) || (name.endsWith(".pcd") ) )
      {
         return "<img alt='Image file' src='/assets/dspace/images/doc_icons/generic_image_icon-18x18.png' title='Image ile'/>";
      }
      else if ( (name.endsWith(".mov") ) || (name.endsWith(".qt") ) )
      {
         return "<img alt='Video file' src='/assets/dspace/images/doc_icons/video_icon18x18.png' title='Video file'/>";
      }
      else if ( name.endsWith(".zip")  )
      {
         return "<img alt='Zip file' src='/assets/dspace/images/doc_icons/zip_icon-18x18.png' title='Zipfile'/>";
      } 
      else if ( (name.endsWith(".htm") ) || (name.endsWith(".html") ) )
      {
         return "<img alt='HTML file' src='/assets/dspace/images/doc_icons/html_icon-18x18.PNG' title='HTML file'/>";;
      }
      else if ( (name.endsWith(".wav") ) || (name.endsWith(".aiff") ) || 
                (name.endsWith(".aif")  ) || (name.endsWith(".au") ) || 
                (name.endsWith(".aifc")  ) || (name.endsWith(".snd") ) || 
                (name.endsWith(".ra")  ) || (name.endsWith(".ram") ) || 
                (name.endsWith(".mpa")  ) || (name.endsWith(".abs") ) || 
                (name.endsWith(".mpga") ) || (name.endsWith(".mp3") ) || 
                (name.endsWith(".ma4") )  )
      {
         return "<img alt='Audio file' src='/assets/dspace/images/doc_icons/audio_icon18x18.png' title='Audio file'/>";
      }
      else
      {
         return "<img alt='Unidentified file format' src='/assets/dspace/images/doc_icons/generic_bitstream18x18.png' title='Unidentified file format'/>";
      }
    } else {
      return '';
    }
  }

  /**
   * Gets the Hit highlight
   *
   * @param object
   * @param dso
   *
   * @returns {string} html embedded hit highlight.
   */
  getHitHighlights(object: any, dso: DSpaceObject): string {
    const types = dso.getRenderTypes();
    const entityType = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => (['Person', 'OrgUnit']).includes(type)) as string;
    if (entityType === 'Person') {
      const familyName = this.firstMetadataValue(object, dso, 'person.familyName');
      const givenName = this.firstMetadataValue(object, dso, 'person.givenName');
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return this.firstMetadataValue(object, dso, 'dc.title') || dso.name;
      } else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      }
      return `${familyName}, ${givenName}`;
    } else if (entityType === 'OrgUnit') {
      return this.firstMetadataValue(object, dso, 'organization.legalName');
    }
    return this.firstMetadataValue(object, dso, 'dc.title') || dso.name || this.translateService.instant('dso.name.untitled');
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param object
   * @param dso
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   *
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(object: any, dso: DSpaceObject, keyOrKeys: string | string[]): string {
    return Metadata.firstValue([object.hitHighlights, dso.metadata], keyOrKeys);
  }

}
