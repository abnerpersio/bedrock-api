import { RequestError } from './request-error';

export class SecretNotFound extends RequestError {
  constructor() {
    super('secret not found', 404);
  }
}
