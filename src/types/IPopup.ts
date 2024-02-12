export interface IPopupProps {
  onClose: () => void;
  onConfirm: (event: Event) => void;
  readonly renderedTemplate: DocumentFragment;
}

export interface IPopup extends IPopupProps {
  show: () => void;
  hide: () => void;
}
