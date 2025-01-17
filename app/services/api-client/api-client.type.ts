export interface ApiRequest<ReqType> {
  method: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  data?: ReqType;
  loading?: boolean;
  timeout?: number;
}

export interface ApiResult<T> {
  succeeded: boolean;
  result: T;
  errors: ApiResultError[];
}

interface ApiResultError {
  code: string;
  message: string;
}
