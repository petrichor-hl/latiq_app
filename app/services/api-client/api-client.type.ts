export interface ApiRequest<ReqType> {
  method: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  data?: ReqType;
  loading?: boolean;
  timeout?: number;
}
