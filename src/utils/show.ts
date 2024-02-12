import { toast } from '@/components/toast';

export const show = {
  error(message: string): void {
    console.error(message);
    toast.error(message);
  },
  warning(message: string): void {
    console.warn(message);
    toast.warning(message);
  },
};
