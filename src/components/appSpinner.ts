export const appSpinner = {
  getElement(): HTMLDivElement {
    const element: HTMLDivElement|null = document.querySelector('.app-spinner');
    if (!element) {
      throw new Error('Елемент div спіннер не знайдено!');
    }
    return element;
  },
  show(): void {
    this.getElement().classList.remove('loaded');
  },
  hide(): void {
    this.getElement().classList.add('loaded');
  },
};
