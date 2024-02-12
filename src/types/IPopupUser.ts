import type { IUserInternal } from './IUserInternal';

export interface IPopupUserProps {
  readonly renderedTemplate: DocumentFragment;
}

export interface IPopupUser extends IPopupUserProps {
  getResult: () => Promise<IUserInternal|null>
}
