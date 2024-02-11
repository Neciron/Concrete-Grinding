enum FeedbackRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

const isNumberFeedbackRating = (value: number | undefined): value is FeedbackRating => {
  return (Object.values(FeedbackRating) as number[]).includes(value ?? NaN);
};

export const getFeedbackRatingFromValue = (value: number | undefined): FeedbackRating|undefined => {
  return isNumberFeedbackRating(value) ? value : undefined;
};

enum FeedbackStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}


const isStringFeedbackStatus = (value: string | undefined): value is FeedbackStatus => {
  return (Object.values(FeedbackStatus) as string[]).includes(value ?? '');
};

export const getFeedbackStatusFromValue = (value: string | undefined): FeedbackStatus|undefined => {
  return isStringFeedbackStatus(value) ? value : undefined;
};

export interface FeedbackProps {
  readonly afterGrindingPhotoUrl: string|null;
  readonly beforeGrindingPhotoUrl: string|null;
  /** Example: 2024-02-11T10:00:36.984Z */
  readonly createdAt: Date;
  /** Example: John Doe */
  readonly customer: string;
  readonly id: string;
  readonly rating: FeedbackRating;
  readonly status: FeedbackStatus;
  /** Example: "This is a great product!" */
  readonly text: string;
  /** Example: 2024-02-11T10:00:36.984Z */
  readonly updatedAt: Date|null;
  readonly updatedUserId: string|null;
}

export interface Feedback extends FeedbackProps {}

