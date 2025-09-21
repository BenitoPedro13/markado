export interface StripeApiHandlerResult<T = unknown> {
  status: number;
  body?: T;
  redirectUrl?: string;
}
