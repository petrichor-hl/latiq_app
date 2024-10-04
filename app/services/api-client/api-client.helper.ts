import { create } from 'apisauce';
import { zustandAuth } from '../../zustand/auth.zustand';
import { AxiosRequestConfig } from 'axios';
import { DEFAULT_TIMEOUT } from '../../configs/api.config';

export const createHeader = () => {
  const headers: AxiosRequestConfig['headers'] = {};
  headers.Accept = '*/*';
  // headers['Content-Type'] = 'application/json';
  // headers.Accept và headers['Content-Type'], chỉ 1 trong 2 được set

  const accessToken = zustandAuth.getState().accessToken;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
};

export const api = create({
  baseURL: 'http://192.168.1.12:5076/api',
  withCredentials: false,
  timeout: DEFAULT_TIMEOUT,
});
