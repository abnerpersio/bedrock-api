export class RequestError extends Error {
  private readonly status: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.status = statusCode;
  }

  get statusCode(): number {
    if (this.status > 500 || this.status < 0) return 500;
    return this.status;
  }
}
