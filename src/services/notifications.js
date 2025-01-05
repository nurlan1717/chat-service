import { toast } from 'react-toastify';

export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  warn: (message) => toast.warn(message),
};