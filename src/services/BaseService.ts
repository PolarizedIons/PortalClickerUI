import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export class BaseService {
    private static httpClient = BaseService.recreateClient(null);

    protected static get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.get(url, options).then((res) => res.data);
    }

    protected static post<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.post(url, data, options).then((res) => res.data);
    }

    protected static put<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.put(url, data, options).then((res) => res.data);
    }

    protected static delete<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.delete(url, options).then((res) => res.data);
    }

    protected static patch<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.patch(url, data, options).then((res) => res.data);
    }

    protected static head<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.head(url, options).then((res) => res.data);
    }

    protected static options<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
      return BaseService.httpClient.options(url, options).then((res) => res.data);
    }

    protected static recreateClient(accessToken: string | null): AxiosInstance {
      BaseService.httpClient = axios.create({
        baseURL: BASE_URL,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      });

      return BaseService.httpClient;
    }
}
