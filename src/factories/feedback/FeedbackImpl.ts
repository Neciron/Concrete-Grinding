import type { Feedback } from '@/types';
import type { FeedbackProps } from '@/types';

export class FeedbackImpl implements Feedback {
  public readonly afterGrindingPhotoUrl;
  public readonly beforeGrindingPhotoUrl;
  public readonly createdAt;
  public readonly customer;
  public readonly id;
  public readonly rating;
  public readonly status;
  public readonly text;
  public readonly updatedAt;
  public readonly updatedUserId;

  public constructor(props: FeedbackProps) {
    this.afterGrindingPhotoUrl = props.afterGrindingPhotoUrl;
    this.beforeGrindingPhotoUrl = props.beforeGrindingPhotoUrl;
    this.createdAt = props.createdAt;
    this.customer = props.customer;
    this.id = props.id;
    this.rating = props.rating;
    this.status = props.status;
    this.text = props.text;
    this.updatedAt = props.updatedAt;
    this.updatedUserId = props.updatedUserId;
  }

  public toString(): string {
    return this.id;
  }
}
