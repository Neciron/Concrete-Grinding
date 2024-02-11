import { child } from '@firebase/database';
import type { Feedback } from '@/types';
import { feedbackFactory } from '@/factories/feedback/feedbackFactory';
import type { FirebaseError } from '@firebase/app';
import { fromDateTimeString } from '@/utils';
import { get } from '@firebase/database';
import { getDatabase } from '@firebase/database';
import { getFeedbackRatingFromValue } from '@/types';
import { getFeedbackStatusFromValue } from '@/types';
import { ref } from '@firebase/database';
import { set } from '@firebase/database';
import { show } from '@/utils';
import { toast } from '@/components/toast';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'feedbacks';

interface FeedbackDtoGet {
  readonly after_grinding_photo_url: string|null;
  readonly before_grinding_photo_url: string|null;
  /** Example: 2024-02-11T10:00:36.984Z */
  readonly created_at: string;
  /** Example: John Doe */
  readonly customer: string;
  readonly id: string;
  readonly rating: number;
  readonly status: string;
  /** Example: "This is a great product!" */
  readonly text: string;
  /** Example: 2024-02-11T10:00:36.984Z */
  readonly updated_at: string|null;
  readonly updated_by_user_id: string|null;
}

const dtoGetToFeedback = (dto: FeedbackDtoGet): Feedback => {
  const createdAt = fromDateTimeString(dto.created_at);
  if (!createdAt) {
    console.error('Invalid createdAt', dto.created_at);
    throw new Error('Invalid createdAt');
  }
  const rating = getFeedbackRatingFromValue(dto.rating);
  if (!rating) {
    console.error('Invalid rating', dto.rating);
    throw new Error('Invalid rating');
  }
  const status = getFeedbackStatusFromValue(dto.status);
  if (!status) {
    console.error('Invalid status', dto.status);
    throw new Error('Invalid status');
  }
  const updatedAt = fromDateTimeString(dto.updated_at);
  return feedbackFactory({
    afterGrindingPhotoUrl: dto.after_grinding_photo_url,
    beforeGrindingPhotoUrl: dto.before_grinding_photo_url,
    createdAt,
    customer: dto.customer,
    id: dto.id,
    rating,
    status,
    text: dto.text,
    updatedAt,
    updatedByUserId: dto.updated_by_user_id,
  });
};

const getFeedbacks = async (): Promise<readonly Feedback[]> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, TABLE_NAME)).catch((error: FirebaseError) => {
    console.error(error.message);
    return null;
  });
  if (!snapshot || !snapshot.exists()) {
    show.error('Таблицю з відгуками не знайдено!');
    return [];
  }
  const feedbacks = snapshot.val() as Record<string, FeedbackDtoGet>;
  return Object.values(feedbacks).map(dtoGetToFeedback);
};

const updateFeedback = async (feedback: Feedback): Promise<Feedback|null> => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `${TABLE_NAME}/${feedback.id}`)).catch((error: FirebaseError) => {
    toast.error(`${error.code}: ${error.message}`);
    console.error(error);
  });
  if (!snapshot || !snapshot.exists()) {
    console.error('Feedback not found', feedback.id);
    return null;
  }
  const result = await set(child(dbRef, `${TABLE_NAME}/${feedback.id}`), {
    after_grinding_photo_url: feedback.afterGrindingPhotoUrl,
    before_grinding_photo_url: feedback.beforeGrindingPhotoUrl,
    created_at: feedback.createdAt.toISOString(),
    customer: feedback.customer,
    id: feedback.id,
    rating: feedback.rating,
    status: feedback.status,
    text: feedback.text,
    updated_at: feedback.updatedAt?.toISOString() ?? null,
    updated_by_user_id: feedback.updatedByUserId ?? null,
  }).catch((error: FirebaseError) => {
    show.error(`Помилка збереження відгуку! ${error.code}: ${error.message}`);
    console.error();
    return null;
  });
  if (result === null) {
    console.error('Feedback not saved', feedback.id);
    return null;
  }
  return feedback;
};

const createFeedback = async (feedback: Feedback): Promise<Feedback|null> => {
  const dbRef = ref(getDatabase());
  const id = uuidv4();
  const result = await set(child(dbRef, `${TABLE_NAME}/${id}`), {
    after_grinding_photo_url: feedback.afterGrindingPhotoUrl,
    before_grinding_photo_url: feedback.beforeGrindingPhotoUrl,
    created_at: feedback.createdAt.toISOString(),
    customer: feedback.customer,
    id,
    rating: feedback.rating,
    status: feedback.status,
    text: feedback.text,
    updated_at: feedback.updatedAt?.toISOString() ?? null,
    updated_by_user_id: feedback.updatedByUserId ?? null,
  }).catch((error: FirebaseError) => {
    show.error(`Помилка збереження відгуку! ${error.code}: ${error.message}`);
    console.error();
    return null;
  });
  if (result === null) {
    console.error('Feedback not saved', feedback.id);
    return null;
  }
  return feedback;
};

const saveFeedback = async (feedback: Feedback): Promise<Feedback|null> => {
  if (feedback.id) {
    return updateFeedback(feedback);
  }
  return createFeedback(feedback);
};


export const apiFeedbacks = {
  getFeedbacks,
  saveFeedback,
};
