/**
 * API - Network API layer for the Backyard Monsters client
 * This is the TypeScript equivalent of URLLoaderApi.as
 */

import { GLOBAL } from '@/core/Global';
import { LOGIN } from '@/core/Login';

export interface RequestOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  timeout?: number;
}

export interface KeyValuePair {
  key: string;
  value: string | number | boolean;
}

/**
 * API class for making HTTP requests to the server
 */
export class API {
  private static _data: string = '';

  /**
   * Make a JSON API request (new method added by Refitted team)
   */
  static async invokeApiRequest<T = unknown>(
    url: string,
    data: Record<string, unknown> | null = null,
    method: 'GET' | 'POST' = 'POST',
    onComplete?: (response: T) => void
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available
      if (LOGIN.token) {
        headers['Authorization'] = `Bearer ${LOGIN.token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (data && method !== 'GET') {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      const responseData = await response.json() as T;

      if (onComplete) {
        onComplete(responseData);
      }

      return responseData;
    } catch (error) {
      const errMessage = `Error occurred while making the request: ${(error as Error).message}`;
      GLOBAL.errorMessage(errMessage, GLOBAL.ERROR_ORANGE_BOX_ONLY);
      return null;
    }
  }

  /**
   * Load data from the server (original networking function)
   * Uses key-value pairs to send data in application/x-www-form-urlencoded format
   */
  static async load<T = unknown>(
    baseUrl: string,
    keyValuePairs: Array<[string, string | number | boolean]> | null = null,
    onComplete?: (data: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // Add auth token if available
      if (LOGIN.token) {
        headers['Authorization'] = `Bearer ${LOGIN.token}`;
      }

      // Build form data
      const formData = new URLSearchParams();
      if (keyValuePairs && keyValuePairs.length > 0) {
        API._data = '';
        for (const [key, value] of keyValuePairs) {
          formData.append(key, String(value));
          API._data += `${key}=${value}&`;
        }
      }

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      const responseText = await response.text();
      
      // Try to parse as JSON
      let responseData: T;
      try {
        responseData = JSON.parse(responseText) as T;
      } catch {
        // If not JSON, return as string wrapped in object
        responseData = { data: responseText } as T;
      }

      if (!response.ok) {
        // Handle HTTP errors - still try to get error message from response
        const errorObj = responseData as { error?: string };
        if (errorObj.error && onComplete) {
          // Server sent error in response body, pass to complete handler
          onComplete(responseData);
          return responseData;
        }
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      if (onComplete) {
        onComplete(responseData);
      }

      return responseData;
    } catch (error) {
      console.error('URLLoader Load Error:', baseUrl, error);
      
      if (onError) {
        onError(error as Error);
      }
      
      return null;
    }
  }

  /**
   * Simple GET request
   */
  static async get<T = unknown>(
    url: string,
    onComplete?: (data: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> {
    try {
      const headers: Record<string, string> = {};
      
      if (LOGIN.token) {
        headers['Authorization'] = `Bearer ${LOGIN.token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json() as T;

      if (onComplete) {
        onComplete(responseData);
      }

      return responseData;
    } catch (error) {
      console.error('GET Error:', url, error);
      
      if (onError) {
        onError(error as Error);
      }
      
      return null;
    }
  }

  /**
   * Check network connection
   */
  static async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(GLOBAL.serverUrl + 'connection', {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get the last data string
   */
  static get data(): string {
    return API._data;
  }
}

export default API;
