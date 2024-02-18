import { $t } from '@/scripts/$t';
import { apiFeedbacks } from '@/api';
import type { Feedback } from '@/types';
import { FeedbackRating } from '@/types';
import { FeedbackStatus } from '@/types';
import getPopupFeedback from './PopupFeedback.pug';
import { PopupFeedback } from '@/classes/PopupFeedback';
import { show } from '@/utils';

interface SelectOption<T> {
  readonly text: string;
  readonly value: T;
}

interface FeedbackPopupOptions {
  readonly popup: {
    readonly heading: string;
    readonly customerLabel: string;
    readonly customerPlaceholder: string;
    readonly ratingLabel: string;
    readonly statusLabel: string;
    readonly feedbackLabel: string;
    readonly feedbackPlaceholder: string;
    readonly saveButtonText: string;
    readonly cancelButtonText: string;
  }
  readonly feedback: {
    readonly customer: string;
    readonly rating: FeedbackRating|null;
    readonly status: FeedbackStatus|null;
    readonly text: string;
  }
  readonly ratings: readonly SelectOption<FeedbackRating>[];
  readonly statuses: readonly SelectOption<FeedbackStatus>[];
}

const getStatuses = (): readonly SelectOption<FeedbackStatus>[] => [
  {
    text: $t('app_pending'),
    value: FeedbackStatus.PENDING,
  },
  {
    text: $t('app_approved'),
    value: FeedbackStatus.APPROVED,
  },
  {
    text: $t('app_rejected'),
    value: FeedbackStatus.REJECTED,
  },
];

const getRatings = (): readonly SelectOption<FeedbackRating>[] => [
  {
    text: FeedbackRating.ONE.toString(),
    value: FeedbackRating.ONE,
  },
  {
    text: FeedbackRating.TWO.toString(),
    value: FeedbackRating.TWO,
  },
  {
    text: FeedbackRating.THREE.toString(),
    value: FeedbackRating.THREE,
  },
  {
    text: FeedbackRating.FOUR.toString(),
    value: FeedbackRating.FOUR,
  },
  {
    text: FeedbackRating.FIVE.toString(),
    value: FeedbackRating.FIVE,
  },
];

export const onActionEdit = async (feedbackId: string): Promise<Feedback|null> => {
  const feedback = await apiFeedbacks.getFeedbackById(feedbackId).catch(() => {
    return null;
  });
  if (!feedback) {
    show.error(`Фідбек з id ${feedbackId} не знайдено`);
    return null;
  }
  console.log('feedback');
  console.log(feedback.text);

  const options: FeedbackPopupOptions = {
    popup: {
      customerLabel: $t('app_customer'),
      customerPlaceholder: $t('app_enter_customer'),
      feedbackLabel: $t('app_feedback'),
      feedbackPlaceholder: $t('app_enter_feedback'),
      heading: $t('app_add_feedback'),
      ratingLabel: $t('app_rating'),
      statusLabel: $t('app_status'),
      saveButtonText: $t('app_action_save'),
      cancelButtonText: $t('app_action_cancel'),
    },
    ratings: getRatings(),
    statuses: getStatuses(),
    feedback: {
      customer: feedback.customer,
      rating: feedback.rating,
      status: feedback.status,
      text: feedback.text,
    },
  };
  const renderedTemplate = getPopupFeedback(options);
  const template = document.createElement('template');
  template.innerHTML = renderedTemplate;
  const popup = new PopupFeedback({
    renderedTemplate: template.content,
    feedback,
  });
  return popup.getResult();
};

export const onActionAdd = async (): Promise<Feedback|null> => {
  const options: FeedbackPopupOptions = {
    popup: {
      customerLabel: $t('app_customer'),
      customerPlaceholder: $t('app_enter_customer'),
      feedbackLabel: $t('app_feedback'),
      feedbackPlaceholder: $t('app_enter_feedback'),
      heading: $t('app_add_feedback'),
      ratingLabel: $t('app_rating'),
      statusLabel: $t('app_status'),
      saveButtonText: $t('app_action_save'),
      cancelButtonText: $t('app_action_cancel'),
    },
    ratings: getRatings(),
    statuses: getStatuses(),
    feedback: {
      customer: '',
      rating: null,
      status: null,
      text: '',
    },
  };
  const renderedTemplate = getPopupFeedback(options);
  const template = document.createElement('template');
  template.innerHTML = renderedTemplate;
  const popup = new PopupFeedback({
    renderedTemplate: template.content,
    feedback: null,
  });
  return popup.getResult();
};
