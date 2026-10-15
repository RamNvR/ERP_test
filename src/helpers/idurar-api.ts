import type { APIResponse, Page, Request } from '@playwright/test';
import { environment } from './environment';

export interface ApiEnvelope<T> {
  success: boolean;
  result: T;
  message: string;
}

export class IdurarApi {
  private authorization?: string;

  constructor(private readonly page: Page) {}

  async get<T>(path: string): Promise<ApiEnvelope<T>> {
    const response = await this.page.context().request.get(
      new URL(path, environment.apiBaseURL).toString(),
      { headers: await this.getHeaders() },
    );
    return this.readSuccessfulResponse<T>(response, path);
  }

  async create<T>(
    path: string,
    fields: Record<string, string | number | boolean>,
  ): Promise<ApiEnvelope<T>> {
    const response = await this.page.context().request.post(
      new URL(path, environment.apiBaseURL).toString(),
      {
        headers: await this.getHeaders(),
        multipart: Object.fromEntries(
          Object.entries(fields).map(([key, value]) => [key, String(value)]),
        ),
      },
    );
    return this.readSuccessfulResponse<T>(response, path);
  }

  async createJson<T>(
    path: string,
    body: object,
  ): Promise<ApiEnvelope<T>> {
    const response = await this.page.context().request.post(
      new URL(path, environment.apiBaseURL).toString(),
      {
        headers: await this.getHeaders(),
        data: body,
      },
    );
    return this.readSuccessfulResponse<T>(response, path);
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const appOrigin = new URL(environment.baseURL).origin;
    return {
      authorization: await this.getAuthorization(),
      origin: appOrigin,
      referer: `${appOrigin}/`,
    };
  }

  private async getAuthorization(): Promise<string> {
    if (this.authorization) return this.authorization;

    let resolveAuthorization!: (value: string) => void;
    let rejectAuthorization!: (reason: Error) => void;
    const authorizationPromise = new Promise<string>((resolve, reject) => {
      resolveAuthorization = resolve;
      rejectAuthorization = reject;
    });
    const apiOrigin = new URL(environment.apiBaseURL).origin;
    const onRequest = (request: Request) => {
      if (new URL(request.url()).origin !== apiOrigin) return;
      void request.headerValue('authorization').then((value) => {
        if (value) resolveAuthorization(value);
      });
    };
    const timeout = setTimeout(
      () => rejectAuthorization(new Error('Could not capture the application API authorization header')),
      15_000,
    );

    this.page.on('request', onRequest);
    try {
      await this.page.reload();
      await this.page.getByRole('heading', { name: 'Paid Invoice', exact: true }).waitFor();
      this.authorization = await authorizationPromise;
      return this.authorization;
    } finally {
      clearTimeout(timeout);
      this.page.off('request', onRequest);
    }
  }

  private async readSuccessfulResponse<T>(
    response: APIResponse,
    path: string,
  ): Promise<ApiEnvelope<T>> {
    const body = (await response.json()) as ApiEnvelope<T>;
    if (!response.ok() || !body.success) {
      throw new Error(
        `IDURAR API request ${path} failed (${response.status()}): ${body.message}`,
      );
    }
    return body;
  }
}
