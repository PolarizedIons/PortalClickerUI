import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useEvent } from '../../hooks/UseEvent';
import { UpgradeResponse } from '../../models/responses/UpgradeResponse';
import { ClickerService } from '../../services/ClickerService';
import { LoadingIcon } from '../shared/LoadingIcon';

export const UpgradePanel: FC = () => {
  const [loading, setLoading] = useState(true);
  const [upgrades, setUpgrades] = useState<UpgradeResponse[]>([]);

  useEffect(() => {
    setLoading(true);
    ClickerService.getUpgrades().then((res) => {
      setUpgrades(res);
      setLoading(false);
    });
  }, []);

  const onPurchase = useCallback((upgrade: UpgradeResponse) => {
    setUpgrades((prev) => prev.map((x) => (x.id === upgrade.id ? upgrade : x)));
  }, []);
  useEvent('OnUpgradePurchased', onPurchase);

  const purchase = useCallback((upgrade: UpgradeResponse) => {
    setLoading(true);
    ClickerService.purchaseUpgrade(upgrade.id).then((res) => {
      onPurchase(res);
      setLoading(false);
    });
  }, [onPurchase]);

  return (
    <div className="bg-background-light w-1/5 relative">
      {loading && <LoadingIcon />}
      <div className="text-4xl font-bold p-4 text-center underline">Upgrades</div>
      {upgrades.map((upgrade, i) => (
        <div onClick={loading || upgrade.purchased ? undefined : () => purchase(upgrade)} key={upgrade.id} className={`${upgrade.purchased ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} py-2 px-4 ${i !== 0 ? ' border-t border-white' : ''} hover:bg-white hover:bg-opacity-20`}>
          <div className="flex gap-4 justify-between">
            <div className="text-2xl font-semibold">{upgrade.name}</div>
            {upgrade.purchased && <div className="text-xs uppercase mt-1">Purcahsed</div>}
          </div>
          <div>{upgrade.description}</div>
        </div>
      ))}
    </div>
  );
};
