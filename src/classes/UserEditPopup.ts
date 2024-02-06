import type { IUserEditPopup } from '@/types';
import type { IUserEditPopupProps } from '@/types';
import type { IUserInternal } from '@/types';
import { Popup } from './Popup';

export class UserEditPopup implements IUserEditPopup {
  public readonly userId;
  public readonly renderedTemplate;

  public constructor(props: IUserEditPopupProps) {
    this.userId = props.userId;
    this.renderedTemplate = props.renderedTemplate;
  }
  public async getEditResult(): Promise<IUserInternal|null> {
    return new Promise((resolve) => {
      const popup = new Popup({
        renderedTemplate: this.renderedTemplate,
        onClose: (): void => {
          resolve(null);
        },
      });
      popup.show();
    });
  }
}
