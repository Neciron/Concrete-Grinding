import { apiUserFirebase } from '@/api';
import type { IAdminMenu } from '@/types';
import type { IAdminMenuProps } from '@/types';
import { RouteName } from '@/types';
import { Routes } from '@/scripts/Routes';
import { utils } from '@/scripts/utils';

export class AdminMenu implements IAdminMenu {
  public readonly route;
  public readonly userFirebase;
  public readonly userInternal;

  public constructor(props: IAdminMenuProps) {
    this.route = props.route;
    this.userFirebase = props.userFirebase;
    this.userInternal = props.userInternal;
  }

  public init(): void {
    this.setHeading();
    this.setActiveMenuItem();
    this.addSignOutButtonListener();
  }

  private setHeading(): void {
    const userEmail = this.userFirebase.email;
    const userRole = this.userInternal.role;
    const row = `${userEmail} - ${userRole.toUpperCase()}`;
    const menuHeading = document.getElementById('admin-menu-heading');
    if (!menuHeading) {
      return;
    }
    menuHeading.textContent = row;
  }

  private setActiveMenuItem(): void {
    const menu = document.getElementById('admin-menu');
    if (!menu) {
      return;
    }
    const link = menu.querySelector(`[href="${this.route.path}"]`);
    if (!link) {
      return;
    }
    link.classList.add('admin-menu__item_active');
  }

  private addSignOutButtonListener(): void {
    const signOutButton = document.getElementById('sign-out-button');
    if (!signOutButton) {
      return;
    }
    signOutButton.addEventListener('click', () => {
      apiUserFirebase.signOutFirebase().then(() => {
        utils.navigate(Routes[RouteName.Admin]);
      }).catch((error) => {
        console.error(error);
      });
    });
  }

  private hideNotAllowedMenuItems(): void {
    console.log(this.userInternal);
    console.log('hideNotAllowedMenuItems');
  }
}
