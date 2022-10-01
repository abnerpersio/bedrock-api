import { HttpResponse } from '../types/http';

export class CreateResponse {
  static ok(data?: unknown, message?: string): HttpResponse {
    return {
      status: 200,
      success: true,
      data,
      message,
    };
  }

  static noContent(): HttpResponse {
    return {
      status: 204,
      success: true,
    };
  }
}
