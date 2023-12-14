/**

 */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../configs';

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  cache = new Map();

  get(url: string): HttpResponse<any> | undefined {

    const cached = this.cache.get(url);

    if (!cached || !AppConfig.apiCaching.enable) {
      return undefined;
    }
    return cached.response;
  }

  put(url: string, response: HttpResponse<any>): void {
    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired = Date.now() - AppConfig.apiCaching.age;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }
}
