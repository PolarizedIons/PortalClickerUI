import { ItemResponse } from '../models/responses/ItemResponse';
import { LeaderboardResponse } from '../models/responses/LeaderboardResponse';
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

  public static getItems(): Promise<ItemResponse[]> {
    return this.get('/clicker/item');
  }

  public static purchaseItem(itemId: string): Promise<ItemResponse> {
    return this.post(`/clicker/item/${itemId}`);
  }

  public static getLeaderboard(): Promise<LeaderboardResponse[]> {
    return this.get('/clicker/leaderboard');
  }
}
