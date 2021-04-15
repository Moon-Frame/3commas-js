import axios, { AxiosRequestConfig, Method } from 'axios';
import * as Crypto from 'crypto-js';
import { toPairs } from 'lodash';

const API_URL = 'https://api.3commas.io/';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export interface ThreeCommasConfiguration {
  apiKey: string;
  apiSecret: string;
  url?: string;
}

export class ThreeCommasService {
  constructor(protected configuration: ThreeCommasConfiguration) {}

  private generateSignature(url: string, reqData: string): string {
    return Crypto.HmacSHA256(url + reqData, this.configuration.apiSecret).toString(Crypto.enc.Hex);
  }

  private convertKeyToSnakeCase(key: string): string {
    return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  protected async request<T>(
    method: Method,
    url: string,
    params?: { [key: string]: any },
    formData?: { [key: string]: any }
  ): Promise<T> {
    const urlSearchParams = new URLSearchParams();
    console.log(params);
    for (let [key, value] of toPairs(params)) {
      urlSearchParams.append(this.convertKeyToSnakeCase(key), value);
    }
    const sig = this.generateSignature(url, urlSearchParams.toString());
    const axiosRequestConfig: AxiosRequestConfig = {
      url,
      method,
      params: urlSearchParams,
      headers: { APIKEY: this.configuration.apiKey, Signature: sig },
    };
    if (formData) {
      const bodyFormData = new FormData();
      for (let [key, value] of toPairs(formData)) {
        bodyFormData.append(key, value);
      }
      axiosRequestConfig.data = bodyFormData;
      axiosRequestConfig.headers = {
        ...axiosRequestConfig.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
    try {
      let response = await instance.request<T>(axiosRequestConfig);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
