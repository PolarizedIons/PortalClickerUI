import { PlayerResponse } from '../models/responses/PlayerResponse';
import { UpgradeResponse } from '../models/responses/UpgradeResponse';
import { BaseService } from './BaseService';

export class ClickerService extends BaseService {
  public static getUpgrades(): Promise<UpgradeResponse[]> {
    return this.get('/clicker/upgrade');
  }

  public static purchaseUpgrade(upgradeId: string): Promise<UpgradeResponse> {
    return this.post(`/clicker/upgrade/${upgradeId}`);
  }

  public static getStats(): Promise<PlayerResponse> {
    return this.get('/clicker/stats');
  }
}
