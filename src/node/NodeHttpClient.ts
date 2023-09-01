import * as nodeHttp from 'node:http';
import { Agent as HttpsAgent } from 'node:https';
import type { HttpClient, RequestOptions } from '../api';
import { promiseWithResolvers } from './promise-with-resolvers';

type NodeHttp = typeof nodeHttp;

export class NodeHttpClient implements HttpClient {
  constructor(private readonly http: NodeHttp = nodeHttp) {}

  async jsonRequest<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(
      url,
      (responseData) => JSON.parse(Buffer.concat(responseData).toString()),
      options,
    );
  }

  async emptyRequest(url: string, options?: RequestOptions): Promise<void> {
    return this.makeRequest<void>(
      url,
      (responseData, status) => {
        if (status && status >= 400) {
          return JSON.parse(Buffer.concat(responseData).toString());
        }

        return undefined;
      },
      options,
    );
  }

  private async makeRequest<T>(
    url: string,
    parseBody: (responseData: Uint8Array[], statusCode?: number) => T,
    options?: RequestOptions,
  ): Promise<T> {
    const { promise, reject, resolve } = promiseWithResolvers<T>();

    const request = this.http.request(url, {
      agent: url.startsWith('https') ? new HttpsAgent() : undefined,
      method: options?.method,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    }, (resp) => {
      resp.on('error', reject);

      const responseData: Uint8Array[] = [];
      resp.on('data', (chunk) => {
        responseData.push(chunk);
      });
      resp.on('end', () => {
        const { statusCode } = resp;
        const body = parseBody(responseData, statusCode);

        if (statusCode && statusCode >= 400) {
          reject(body);
        } else {
          resolve(body);
        }
      });
    });

    if (options?.body) {
      request.write(options.body);
    }

    request.on('error', reject);
    request.end();

    return promise;
  }
}
