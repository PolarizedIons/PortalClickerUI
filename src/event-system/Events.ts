import { OnPortalCountUpdated } from './events/OnPortalCountUpdated';
import { UpgradePurchasedEvent } from './events/UpgradePurchasedEvent';

export interface Events {
  'OnUpgradePurchased': UpgradePurchasedEvent;
  'OnPortalCountUpdated': OnPortalCountUpdated;
  'PortalClicked': undefined;
  'PurchaseMade': number;
}

export const HubEvents: (keyof Events)[] = [
  'OnUpgradePurchased',
  'OnPortalCountUpdated',
];
