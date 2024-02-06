import type { IPopup } from '@/types';
import type { IPopupProps } from '@/types';
import { show } from '@/utils';

export class Popup implements IPopup {
  public readonly renderedTemplate;
  public readonly onClose;

  public constructor(props: IPopupProps) {
    this.renderedTemplate = props.renderedTemplate;
    this.onClose = props.onClose;
  }

  public show(): void {
    document.body.appendChild(this.renderedTemplate);
    setTimeout(() => {
      const popup = document.querySelector('.popup');
      const content = document.querySelector('.popup__content');
      if (!popup || !content) {
        show.error('Помилка відображення вікна');
        return;
      }
      popup.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('popup')) {
          this.hide();
        }
      });
      popup.classList.remove('popup_hidden');
      content.classList.remove('popup__content_hidden');
    }, 300);
  }

  public hide(): void {
    this.onClose();
    const popup = document.querySelector('.popup');
    const content = document.querySelector('.popup__content');
    if (!popup || !content) {
      console.log('popup', popup);
      console.log('content', content);
      show.error('Помилка відображення вікна під час закриття');
      return;
    }
    content.classList.add('popup__content_hidden');
    popup.classList.add('popup_hidden');
    setTimeout(() => {
      popup.remove();
    }, 500);
  }
}

