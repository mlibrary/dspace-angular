README.md CC license deprecated

`submission-section-cc-licenses.component.spec.ts` still depends on two things

The template. `submission-section-cc-licenses.component.html` must be converted to *ngIf/*ngFor. The @if/@for/@let version won't compile on DSpace 7.
The component. It must have `required$`, `getSectionStatus()`, `restoreSelectionFromStoredUri`, and the `section-state` removal logic. Otherwise those tests won't compile or will fail.


Things to check outside `submission-section-cc-licenses.component.ts` 

1. Module declarations. Since the imports array is gone, SubmissionModule (src/app/submission/submission.module.ts) has to provide everything the template uses. Stock DSpace 7 already declares this component there. Confirm the module, directly or through SharedModule, includes:

- FormsModule for ngModel
- NgbModule (or NgbDropdownModule) for ngbDropdown
- InfiniteScrollModule for infiniteScroll. Stock DSpace 7's CC template may not use infinite scroll, so check this one specifically.
- TranslateModule, plus VarDirective and DsSelectComponent (both come from SharedModule)

2. Loading component selector in the template. In DSpace 7, the themed loading component's selector is ds-themed-loading. ds-loading is the unthemed base component; DSpace 8 renamed them. Use this in the template:

`<ds-themed-loading *ngIf="!licenseLink"></ds-themed-loading>`

3. FindListOptions path. core/data/find-list-options.model.ts exists in DSpace 7.4 and later. On 7.0–7.3, import FindListOptions from ../../../core/data/request.models instead.

4. Base class members. This file assumes SectionModelComponent in your version provides ngOnInit() and updateSectionStatus(), and declares sectionService as abstract. Stock DSpace 7.x does. If you get an error like "Property 'updateSectionStatus' does not exist," that file has been customized or differs.
