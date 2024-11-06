import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { SectionModelComponent } from '../models/section.model';
import {
  hasValue,
  isNotEmpty,
  isNotUndefined,
  isUndefined,
} from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { ResourcePolicyDataService } from '../../../core/resource-policy/resource-policy-data.service';
import { SubmissionUploadsConfigDataService } from '../../../core/config/submission-uploads-config-data.service';
import { SubmissionUploadsModel } from '../../../core/config/models/config-submission-uploads.model';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionObjectEntry } from '../../objects/submission-objects.reducer';
import { AlertType } from '../../../shared/alert/aletr-type';
import { RemoteData } from '../../../core/data/remote-data';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
import { Collection } from '../../../core/shared/collection.model';
import { AccessConditionOption } from '../../../core/config/models/config-access-condition-option.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { UploaderOptions } from '../../../shared/upload/uploader/uploader-options.model';
import { AuthService } from '../../../core/auth/auth.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { Group } from '../../../core/eperson/models/group.model';

export const POLICY_DEFAULT_NO_LIST = 1;
export const POLICY_DEFAULT_WITH_LIST = 2;

export interface AccessConditionGroupsMapEntry {
  accessCondition: string;
  groups: Group[];
}

@Component({
  selector: 'ds-submission-section-upload',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})
@renderSectionFor(SectionsType.Upload)
export class SubmissionSectionUploadComponent
  extends SectionModelComponent
  implements OnInit, OnDestroy
{
  public AlertTypeEnum = AlertType;
  public fileIndexes: string[] = [];
  public fileList: any[] = [];
  public fileNames: string[] = [];
  public collectionName: string;
  public collectionDefaultAccessConditions: any[] = [];
  public collectionPolicyType: number;
  public configMetadataForm$: Observable<SubmissionFormsModel>;
  public availableAccessConditionOptions: AccessConditionOption[];
  public required$ = new BehaviorSubject<boolean>(true);
  protected subs: Subscription[] = [];
  
  public uploadEnabled$: Observable<boolean>;
  public uploadFilesOptions: UploaderOptions = new UploaderOptions();

  constructor(
    private authService: AuthService,
    private bitstreamService: SectionUploadService,
    private changeDetectorRef: ChangeDetectorRef,
    private collectionDataService: CollectionDataService,
    private groupService: GroupDataService,
    private resourcePolicyService: ResourcePolicyDataService,
    protected sectionService: SectionsService,
    private submissionService: SubmissionService,
    private uploadsConfigService: SubmissionUploadsConfigDataService,
    public dsoNameService: DSONameService,
    private halService: HALEndpointService, // Add this line
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string
  ) {
    super(undefined, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    this.initUploadOptions();
    this.onSectionInit();
  }

  private initUploadOptions() {
    this.uploadEnabled$ = this.sectionService.isSectionTypeAvailable(this.submissionId, SectionsType.Upload);

    this.halService.getEndpoint(this.submissionService.getSubmissionObjectLinkName())
      .pipe(
        filter((href: string) => isNotEmpty(href)),
        distinctUntilChanged()
      ).subscribe((endpointURL) => {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
      });
  }

  onSectionInit() {
    const config$ = this.uploadsConfigService.findByHref(this.sectionData.config, true, false, followLink('metadata')).pipe(
      getFirstSucceededRemoteData(),
      map((config) => config.payload)
    );

    this.configMetadataForm$ = config$.pipe(
      switchMap((config: SubmissionUploadsModel) =>
        config.metadata.pipe(
          getFirstSucceededRemoteData(),
          map((remoteData: RemoteData<SubmissionFormsModel>) => remoteData.payload)
        )
      )
    );

    this.subs.push(
      this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter((submissionObject: SubmissionObjectEntry) =>
          isNotUndefined(submissionObject) && !submissionObject.isLoading
        ),
        filter((submissionObject: SubmissionObjectEntry) =>
          isUndefined(this.collectionId) ||
          this.collectionId !== submissionObject.collection
        ),
        tap(
          (submissionObject: SubmissionObjectEntry) =>
            (this.collectionId = submissionObject.collection)
        ),
        mergeMap((submissionObject: SubmissionObjectEntry) =>
          this.collectionDataService.findById(submissionObject.collection)
        ),
        filter((rd: RemoteData<Collection>) =>
          isNotUndefined(rd.payload)
        ),
        tap((collectionRemoteData: RemoteData<Collection>) => {
          this.collectionName = this.dsoNameService.getName(
            collectionRemoteData.payload
          );
        }),
        mergeMap(() => config$)
      ).subscribe((config: SubmissionUploadsModel) => {
        this.required$.next(config.required);
        this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions)
          ? config.accessConditionOptions
          : [];
        this.collectionPolicyType = this.availableAccessConditionOptions.length > 0
          ? POLICY_DEFAULT_WITH_LIST
          : POLICY_DEFAULT_NO_LIST;
        this.changeDetectorRef.detectChanges();
      }),

      observableCombineLatest(this.configMetadataForm$,
        this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id)).pipe(
        filter(([configMetadataForm, fileList]: [SubmissionFormsModel, any[]]) => {
          return isNotEmpty(configMetadataForm) && isNotUndefined(fileList);
        }),
        distinctUntilChanged())
        .subscribe(([configMetadataForm, fileList]: [SubmissionFormsModel, any[]]) => {
            this.fileList = [];
            this.fileIndexes = [];
            this.fileNames = [];
            this.changeDetectorRef.detectChanges();
            if (isNotUndefined(fileList) && fileList.length > 0) {
              fileList.forEach((file) => {
                this.fileList.push(file);
                this.fileIndexes.push(file.uuid);
                this.fileNames.push(this.getFileName(configMetadataForm, file));
              });
            }
            this.changeDetectorRef.detectChanges();
          }
        )
    );
  }

  /**
   * Return file name from metadata
   *
   * @param configMetadataForm
   *    the bitstream's form configuration
   * @param fileData
   *    the file metadata
   */
  private getFileName(configMetadataForm: SubmissionFormsModel, fileData: any): string {
    const metadataName: string = configMetadataForm.rows[0].fields[0].selectableMetadata[0].metadata;
    let title: string;
    if (isNotEmpty(fileData.metadata) && isNotEmpty(fileData.metadata[metadataName])) {
      title = fileData.metadata[metadataName][0].display;
    } else {
      title = fileData.uuid;
    }
    return title;
  }


  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    // if not mandatory, always true
    // if mandatory, at least one file is required
    return observableCombineLatest(this.required$,
      this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id),
      (required, fileList: any[]) => {
        return (!required || (isNotUndefined(fileList) && fileList.length > 0));
      });
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
