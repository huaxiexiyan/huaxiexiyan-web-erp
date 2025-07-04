import type { defineComponent } from 'vue';

import type { RouteMeta } from '@/types/interface';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface RouteItem {
  id: string;
  path: string;
  name: string;
  component?: Component | string;
  components?: Component;
  redirect?: string;
  meta: RouteMeta;
  children?: Array<RouteItem>;
}

export interface LoginResult {
  username: string;
  nickname: string;
  token: string;
}
