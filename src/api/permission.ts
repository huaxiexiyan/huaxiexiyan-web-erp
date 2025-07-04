import type { LoginResult, RouteItem } from '@/api/model/permissionModel';
import { request } from '@/utils/request';

const Api = {
  MenuList: '/erp/auth/menu',
  Login: '/erp/auth/login',
};

export function getMenuList() {
  return request.get<Array<RouteItem>>({
    url: Api.MenuList,
  });
}

export function login(userInfo: Record<string, unknown>) {
  return request.post<LoginResult>({
    url: Api.Login,
    data: userInfo,
  });
}
