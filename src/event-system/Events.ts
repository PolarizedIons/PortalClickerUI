import { ItemResponse } from '../models/responses/ItemResponse';
import { PlayerResponse } from '../models/responses/PlayerResponse';
import { UpgradeResponse } from '../models/responses/UpgradeResponse';

export interface Events {
  'OnUpgradePurchased': UpgradeResponse;
  'OnPortalCountUpdated': number;
  'OnPlayerStatsUpdated': PlayerResponse;
  'OnItemPurchased': ItemResponse
  'PortalClicked': undefined;
  'PurchaseMade': number;
  'ConnectionLost': undefined;
  'ConnectionRestored': undefined;
}

export const HubEvents: (keyof Events)[] = [
  'OnUpgradePurchased',
  'OnPortalCountUpdated',
  'OnPlayerStatsUpdated',
  'OnItemPurchased',
];
