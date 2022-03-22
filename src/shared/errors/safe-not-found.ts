import { RequestError } from './request-error';

export class SafeNotFound extends RequestError {
  constructor() {
    super('safe not found', 404);
  }
}
