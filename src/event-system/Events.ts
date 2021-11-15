import { OnPortalCountUpdated } from './events/OnPortalCountUpdated';
import { UpgradePurchasedEvent } from './events/UpgradePurchasedEvent';

export interface Events {
  'OnUpgradePurchased': UpgradePurchasedEvent;
  'OnPortalCountUpdated': OnPortalCountUpdated;
}

export const HubEvents: (keyof Events)[] = [
  'OnUpgradePurchased',
  'OnPortalCountUpdated',
];
