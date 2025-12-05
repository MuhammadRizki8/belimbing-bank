export type ApiPayload<T = unknown> = {
  success: boolean;
  message?: string;
  data: T;
};
