import { UpgradePurchasedEvent } from './events/UpgradePurchasedEvent';

export interface Events {
    'OnUpgradePurchased': UpgradePurchasedEvent;
}

export const HubEvents: (keyof Events)[] = [
  'OnUpgradePurchased',
];
