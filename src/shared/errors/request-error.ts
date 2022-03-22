const DEFAULT_STATUS_CODE = 500;
export class RequestError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = DEFAULT_STATUS_CODE) {
    super(message);

    if (statusCode > 500 || statusCode < 0) this.statusCode = DEFAULT_STATUS_CODE;
    else this.statusCode = statusCode;
  }
}
