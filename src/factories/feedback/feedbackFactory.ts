import type { Feedback } from '@/types';
import { FeedbackImpl } from './FeedbackImpl';

export const feedbackFactory = (...[data]: ConstructorParameters<typeof FeedbackImpl>): Feedback => new FeedbackImpl(data);
