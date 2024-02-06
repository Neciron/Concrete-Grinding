export interface IPopupProps {
  readonly renderedTemplate: DocumentFragment;
  onClose: () => void;
}

export interface IPopup extends IPopupProps {
  show: () => void;
  hide: () => void;
}
