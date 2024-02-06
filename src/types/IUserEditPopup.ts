import type { IUserInternal } from './IUserInternal';

export interface IUserEditPopupProps {
  readonly renderedTemplate: DocumentFragment;
  readonly userId: string;
}

export interface IUserEditPopup extends IUserEditPopupProps {
  getEditResult: () => Promise<IUserInternal|null>
}
