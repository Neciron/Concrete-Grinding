import type { Feedback } from './Feedback';

export interface IPopupFeedbackProps {
  readonly feedback: Feedback|null;
  readonly renderedTemplate: DocumentFragment;
}

export interface IPopupFeedback extends IPopupFeedbackProps {
  getResult: () => Promise<Feedback|null>
}
