import { LoginResponse } from '../models/responses/LoginResponse';
import { BaseService } from './BaseService';

export class SecurityService extends BaseService {
  public static refresh(userId: string, refreshToken: string) {
    return this.post<LoginResponse>('/security/refresh', { userId, refreshToken })
      .then((res) => {
        BaseService.recreateClient(res.accessToken);
        return res;
      });
  }

  public static login(username: string, password: string) {
    return this.post<LoginResponse>('/security/login', { username, password })
      .then((res) => {
        BaseService.recreateClient(res.accessToken);
        return res;
      });
  }
}
