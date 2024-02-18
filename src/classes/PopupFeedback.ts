import { checkInput } from '@/scripts/validation';
import type { Feedback } from '@/types';
import { feedbackFactory } from '@/factories/feedback/feedbackFactory';
import { FeedbackRating } from '@/types';
import { FeedbackStatus } from '@/types';
import { getFeedbackRatingFromValue } from '@/types';
import { getFeedbackStatusFromValue } from '@/types';
import type { IPopupFeedback } from '@/types';
import type { IPopupFeedbackProps } from '@/types';
import { Popup } from './Popup';
import { validationRules } from '@/scripts/validation';

interface FeedbackFormElement extends HTMLFormElement {
  readonly 'customer': HTMLInputElement;
  readonly 'rating': HTMLSelectElement;
  readonly 'status': HTMLSelectElement;
  readonly 'text': HTMLSelectElement;
}

export class PopupFeedback implements IPopupFeedback {
  public readonly renderedTemplate;
  public readonly feedback;

  public constructor(props: IPopupFeedbackProps) {
    this.renderedTemplate = props.renderedTemplate;
    this.feedback = props.feedback;
  }
  public async getResult(): Promise<Feedback|null> {
    return new Promise((resolve) => {
      const popup = new Popup({
        renderedTemplate: this.renderedTemplate,
        onClose: (): void => {
          resolve(null);
        },
        onConfirm: (event): void => {
          const form = event.target as FeedbackFormElement;
          const formIsValid = this.validateForm(form);
          if (!formIsValid) {
            return;
          }
          const feedback = feedbackFactory({
            customer: form['customer'].value,
            rating: getFeedbackRatingFromValue(Number(form['rating'].value)) ?? FeedbackRating.ONE,
            status: getFeedbackStatusFromValue(form['status'].value) ?? FeedbackStatus.PENDING,
            text: form['text'].value,
            createdAt: new Date(),
            id: this.feedback?.id ?? '',
            updatedAt: this.feedback?.updatedAt ?? null,
            updatedByUserId: this.feedback?.updatedByUserId ?? null,
          });
          resolve(feedback);
          popup.hide();
        },
      });
      popup.show();
    });
  }

  private validateForm(form: FeedbackFormElement): boolean {
    const { required, maxLength } = validationRules;
    const customerIsValid = checkInput(form['customer'], [required, maxLength(255)]);
    const ratingIsValid = checkInput(form['rating'], [required]) && Boolean(getFeedbackRatingFromValue(Number(form['rating'].value)));
    const statusIsValid = checkInput(form['status'], [required]) && Boolean(getFeedbackStatusFromValue(form['status'].value));
    const textIsValid = checkInput(form['text'], [required, maxLength(255)]);
    return customerIsValid &&
      ratingIsValid &&
      statusIsValid &&
      textIsValid;
  }
}
