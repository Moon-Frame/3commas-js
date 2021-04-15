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
  constructor(protected configuration: ThreeCommasConfiguration, protected prefixApiUrl: string) {}

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
    data?: { [key: string]: any }
  ): Promise<T> {
    const urlSearchParams = new URLSearchParams();
    for (let [key, value] of toPairs(params)) {
      urlSearchParams.append(this.convertKeyToSnakeCase(key), value);
    }
    const fullUrl = `${this.prefixApiUrl}${url}`;
    const sig = this.generateSignature(fullUrl, urlSearchParams.toString());
    const axiosRequestConfig: AxiosRequestConfig = {
      url: fullUrl,
      method,
      data: data ? data : undefined,
      params: urlSearchParams,
      headers: { APIKEY: this.configuration.apiKey, Signature: sig },
    };
    try {
      let response = await instance.request<T>(axiosRequestConfig);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
