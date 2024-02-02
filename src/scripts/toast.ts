type ToastType = 'success'|'warning'|'error';

interface Toast {
  readonly id: string;
  readonly type: ToastType;
  readonly element: HTMLDivElement;
}

const ToastProcessor = {
  successSvg: '<i class="fa-solid fa-check"></i>',
  warningSvg: '<i class="fa-solid fa-exclamation"></i>',
  errorSvg: '<i class="fa-solid fa-circle-exclamation"></i>',
  toastsQueue: [] as Toast[],
  getRandomHash(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
  initToast(message: string, type: ToastType): void {
    if (this.toastsQueue.some((toast) => toast.element.textContent === message && toast.type === type)) {
      return;
    }
    const toast = this.getNewToast(message, type);
    this.toastsQueue.push(toast);
    if (this.toastsQueue.length === 1) {
      this.showToast(toast);
      setTimeout(() => {
        this.removeToast(toast);
      }, type === 'success' ? 2000 : 5000);
    }
  },
  showToast(toast: Toast): void {
    const { element } = toast;
    document.body.appendChild(element);
    element.style.top = '20px';
    element.style.right = '0';
    element.style.transform = 'translateX(calc(100% + 20px))';
    setTimeout(() => {
      element.style.transform = 'translateX(-20px)';
    }, 100);
    element.onclick = (): void => {
      this.removeToast(toast);
    };
  },
  removeToast(toast: Toast): void {
    const { id } = toast;
    const elem = document.getElementById(id);
    if (!elem) {
      return;
    }
    elem.style.transform = 'translateX(calc(100% + 20px))';
    setTimeout(() => {
      document.body.removeChild(elem);
      this.toastsQueue.shift();
      const nextToast = this.toastsQueue[0];
      if (nextToast) {
        this.showToast(nextToast);
        setTimeout(() => {
          this.removeToast(nextToast);
        }, 3000);
      }
    }, 800);
  },
  getNewToast(message: string, type: ToastType): Toast {
    const element = document.createElement('div');
    element.classList.add('toast');
    if (type === 'success') {
      element.classList.add('toast_success');
      element.innerHTML = `${this.successSvg}<span>${message}</span>`;
    } else if (type === 'warning') {
      element.classList.add('toast_warning');
      element.innerHTML = `${this.warningSvg}<span>${message}</span>`;
    } else {
      element.classList.add('toast_error');
      element.innerHTML = `${this.errorSvg}<span>${message}</span>`;
    }
    const id = this.getRandomHash();
    element.id = id;
    return { element, type, id };
  },
};

export const toast = {
  success: (message: string): void => {
    ToastProcessor.initToast(message, 'success');
  },
  warning: (message: string): void => {
    ToastProcessor.initToast(message, 'warning');
  },
  error: (message: string): void => {
    ToastProcessor.initToast(message, 'error');
  },
};
