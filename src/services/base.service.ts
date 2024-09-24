import axios from 'axios';
import _ from 'lodash';
import { BASE_URL } from '../configs/config';

class RefreshTokenControl {
  private _lock: boolean = false;
  private _unlock_func!: (value: any) => void;
  private _wait_func!: Promise<void>;
  Lock() {
    this._lock = true;
    this._wait_func = new Promise((resolve) => {
      this._unlock_func = resolve;
    });
    return this._wait_func;
  }
  IsLocking() {
    return this._lock;
  }
  async Wait() {
    if (this._wait_func) {
      await this._wait_func;
    }
  }
  Unlock() {
    if (this._unlock_func) {
      this._unlock_func(true);
    }
    this._lock = false;
  }
}
const refresh_control = new RefreshTokenControl();

export const MAX_ATTEMPT = 3;

export function getAccessToken(): string {
  return localStorage.getItem('access_token')!;
}
export function getRefreshToken(): string {
  return localStorage.getItem('refresh_token')!;
}

export function setAccessToken(token: string) {
  return localStorage.setItem('access_token', token);
}
export function setRefreshToken(token: string) {
  return localStorage.setItem('refresh_token', token);
}

export enum APIOps {
  FETCH = 'FETCH',
  GET = 'GET',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 60,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});

async function callAPI<I, O>(
  inp: {
    method: string;
    url: string;
    data: I;
    headers?: any;
  } = {
    method: 'GET',
    url: '/',
    data: {} as I,
    headers: {},
  },
  attempt: number = 0
): Promise<O> {
  try {
    return (await axiosInstance({
      method: inp.method,
      url: inp.url,
      headers: {
        'X-Token': localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'TZ-Offset': new Date().getTimezoneOffset(),
        ...inp.headers,
      },
      data: inp.data,
    }).then((res) => res.data)) as O;
  } catch (error: any) {
    console.log({ error });
    if ((error as any)?.response?.data?.name === 'UNAUTHORIZED' && attempt < MAX_ATTEMPT) {
      if (refresh_control.IsLocking()) {
        await refresh_control.Wait();
        return await callAPI(inp, attempt + 1);
      }
      refresh_control.Lock();
      const refreshRes: { new_token: string; new_refresh_token: string } = await axiosInstance({
        url: '/auth/user/refresh_token',
        method: 'POST',
        data: { refresh_token: getRefreshToken(), access_token: getAccessToken() },
      }).then((res) => res.data);
      setAccessToken(refreshRes.new_token);
      setRefreshToken(refreshRes.new_refresh_token);
      refresh_control.Unlock();
      return await callAPI(inp, attempt + 1);
    } else {
      throw new Error((error as any)?.response?.data?.message);
    }
  }
}

export abstract class BaseService {
  protected async Fetch<O>(inp: APIBuilder<any>): Promise<O> {
    const built = inp.setOp(APIOps.FETCH).build();
    return (await callAPI({
      url: built.path,
      method: 'GET',
      data: built.body,
      headers: built.headers,
    })) as O;
  }
  protected async Get<O>(inp: APIBuilder<any>): Promise<O> {
    const built = inp.setOp(APIOps.GET).build();
    return (await callAPI({
      url: built.path,
      method: 'GET',
      data: built.body,
      headers: built.headers,
    })) as O;
  }
  protected async Post<I, O>(inp: APIBuilder<I>): Promise<O> {
    const built = inp.setOp(APIOps.CREATE).build();
    return (await callAPI({
      url: built.path,
      method: 'POST',
      data: built.body,
      headers: built.headers,
    })) as O;
  }
  protected async Put<I, O>(inp: APIBuilder<I>): Promise<O> {
    const built = inp.setOp(APIOps.UPDATE).build();
    return (await callAPI({
      url: built.path,
      method: 'PUT',
      data: built.body,
      headers: built.headers,
    })) as O;
  }
  protected async Delete<O>(inp: APIBuilder<any>): Promise<O> {
    const built = inp.setOp(APIOps.DELETE).build();
    return (await callAPI({
      url: built.path,
      method: 'DELETE',
      data: built.body,
      headers: built.headers,
    })) as O;
  }
}
export class APIBuilder<T = void> {
  private path: string = '/';
  private headers: any = {};
  private queries: { key: string; value: string }[] = [];
  private body: T = {} as T;
  private params: string[] = [];
  private search?: string;
  private limit: number = 10;
  private page: number = 1;
  private filter: { key: string; value: string }[] = [];
  private ignore: { key: string; value: string }[] = [];
  private includes: string[] = [];
  private sort: { key: string; value: string }[] = [];
  private location: number[] = [];
  private op: APIOps = APIOps.GET;
  setOp(op: APIOps = APIOps.GET) {
    this.op = op;
    return this;
  }
  setPath(path: string) {
    this.path = path;
    return this;
  }
  setHeader(key: string, value: string) {
    _.set(this.headers, key, value);
    return this;
  }
  setBody(body: T) {
    if (body) {
      this.body = body;
    }
    return this;
  }
  setParams(params: string[]) {
    if (params) {
      this.params = params;
    }
    return this;
  }
  addParam(param: string) {
    this.params.push(param);
    return this;
  }
  setQueries(queries: { key: string; value: string }[]) {
    if (queries) {
      this.queries = queries;
    }
    return this;
  }
  addQuery(key: string, value: string) {
    this.queries.push({ key, value });
    return this;
  }
  setPage(page: number) {
    this.page = page;
    return this;
  }
  setLimit(limit: number) {
    this.limit = limit;
    return this;
  }
  setSearch(search: string) {
    this.search = search;
    return this;
  }
  setFilter(key: string, value: string) {
    if (!!key && !!value) {
      this.filter.push({ key, value });
    }
    return this;
  }
  setIgnore(key: string, value: string) {
    this.ignore.push({ key, value });
    return this;
  }
  setIncludes(key: string) {
    this.includes.push(key);
    return this;
  }
  setSort(key: string, value: string) {
    this.sort.push({ key, value });
    return this;
  }
  setLocation(location: number[]) {
    this.location = location;
    return this;
  }
  build(): APIBuilderResult<T> {
    if (this.op === APIOps.FETCH) {
      if (this.filter.length > 0) {
        this.queries.push({
          key: 'filter',
          value: this.filter.map(({ key, value }) => `${key}:${value}`).join(','),
        });
      }
      if (this.ignore.length > 0) {
        this.queries.push({
          key: 'ignore',
          value: this.ignore.map(({ key, value }) => `${key}:${value}`).join(','),
        });
      }
      if (this.includes.length > 0) {
        this.queries.push({ key: 'includes', value: this.includes.join(',') });
      }
      if (this.search) {
        this.queries.push({ key: 'search', value: this.search });
      }
      if (this.sort.length > 0) {
        this.queries.push({
          key: 'sort',
          value: this.sort.map(({ key, value }) => `${key}:${value}`).join(','),
        });
      }
      this.queries.push({ key: 'page', value: this.page.toString() });
      this.queries.push({ key: 'limit', value: this.limit.toString() });
      if (!!this.location?.length && !!this.location?.[0] && !!this.location?.[1]) {
        this.queries.push({ key: 'location', value: `${this.location[0]},${this.location[1]}` });
      }
    }
    const queryStr = this.queries
      .map((e) => {
        return `${e.key}=${e.value}`;
      })
      .join('&');
    if (this.params) {
      this.path = [this.path, ...this.params].join('/');
    }
    if (queryStr) {
      this.path = [this.path, queryStr].join('?');
    }
    return {
      path: this.path,
      body: this.body,
      headers: this.headers,
    };
  }
}

export interface APIBuilderResult<T> {
  path: string;
  headers: any;
  body: T;
}
