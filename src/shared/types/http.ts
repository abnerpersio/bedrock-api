type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;

export type HttpResponse = {
  status: HttpStatus;
  success: boolean;
  data?: unknown;
  message?: string;
};

export interface UseCase<T = unknown> {
  execute: (params: T) => Promise<HttpResponse>;
}
