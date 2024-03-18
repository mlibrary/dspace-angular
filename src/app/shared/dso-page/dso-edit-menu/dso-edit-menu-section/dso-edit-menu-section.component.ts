import { Component, Inject, Injector, OnInit } from '@angular/core';
import { rendersSectionForMenu } from 'src/app/shared/menu/menu-section.decorator';
import { MenuSectionComponent } from 'src/app/shared/menu/menu-section/menu-section.component';
import { MenuService } from '../../../menu/menu.service';
import { isNotEmpty } from '../../../empty.util';
import { MenuID } from '../../../menu/menu-id.model';
import { MenuSection } from '../../../menu/menu-section.model';


import { RoleService } from '../../../../core/roles/role.service';
import { combineLatest, Observable } from 'rxjs';
/**
 * Represents a non-expandable section in the dso edit menus
 */
@Component({
  /* tslint:disable:component-selector */
  selector: 'ds-dso-edit-menu-section',
  templateUrl: './dso-edit-menu-section.component.html',
  styleUrls: ['./dso-edit-menu-section.component.scss']
})
@rendersSectionForMenu(MenuID.DSO_EDIT, false)
export class DsoEditMenuSectionComponent extends MenuSectionComponent implements OnInit {

  menuID: MenuID = MenuID.DSO_EDIT;
  itemModel;
  hasLink: boolean;
  canActivate: boolean;

  isAdmin$: Observable<boolean>;
  isSiteAdmin
  constructor(
    @Inject('sectionDataProvider') menuSection: MenuSection,
    protected menuService: MenuService,
    protected roleService: RoleService,
    protected injector: Injector,
  ) {
    super(menuSection, menuService, injector);
    this.itemModel = menuSection.model;


  }

  ngOnInit(): void {
    console.log("TESTTTTT: itemModel Link ==> " + this.itemModel?.link);
    this.hasLink = isNotEmpty(this.itemModel?.link);
    this.canActivate = isNotEmpty(this.itemModel?.function);
    //this.canActivate = false;
    this.isAdmin$ = this.roleService.isAdmin();

    super.ngOnInit();
  }

  /**
   * Activate the section's model funtion
   */
  public activate(event: any) {
    event.preventDefault();
    if (!this.itemModel.disabled) {
      this.itemModel.function();
    }
    event.stopPropagation();
  }
}
