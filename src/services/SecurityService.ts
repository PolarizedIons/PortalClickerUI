import { LoginResponse } from '../models/responses/LoginResponse';
import { SignalR } from '../SignalR';
import { BaseService } from './BaseService';

export class SecurityService extends BaseService {
  public static refresh(userId: string, refreshToken: string) {
    return this.post<LoginResponse>('/security/refresh', { userId, refreshToken })
      .then((res) => {
        BaseService.recreateClient(res.accessToken);
        if (!SignalR.isConnected) {
          SignalR.accessToken = res.accessToken;
          SignalR.start();
        }
        return res;
      });
  }

  public static login(username: string, password: string) {
    return this.post<LoginResponse>('/security/login', { username, password })
      .then((res) => {
        BaseService.recreateClient(res.accessToken);
        SignalR.accessToken = res.accessToken;
        SignalR.start();
        return res;
      });
  }

  public static register(email: string, username: string, password: string) {
    return this.post<LoginResponse>('/security/register', { email, username, password })
      .then((res) => {
        BaseService.recreateClient(res.accessToken);
        SignalR.accessToken = res.accessToken;
        SignalR.start();
        return res;
      });
  }
}
