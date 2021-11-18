import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { EventSystem } from '../../event-system/EventSystem';
import { useDebugMode } from '../../hooks/UseDebugMode';
import { useEvent } from '../../hooks/UseEvent';
import { UpgradeResponse } from '../../models/responses/UpgradeResponse';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { ClickerService } from '../../services/ClickerService';
import { formatPortals } from '../../utils/NumberUtils';
import { LoadingIcon } from '../shared/LoadingIcon';
import { useToast } from '../shared/Toaster';
import { Tooltip } from '../shared/Tooltip';

export const UpgradePanel: FC = () => {
  const [loading, setLoading] = useState(true);
  const [upgrades, setUpgrades] = useState<UpgradeResponse[]>([]);
  const [player, setPlayer] = useRecoilState(PlayerState);
  const debugMode = useDebugMode();
  const addToast = useToast();

  useEffect(() => {
    setLoading(true);
    ClickerService.getUpgrades().then((res) => {
      setUpgrades(res);
      setLoading(false);
    });
  }, []);

  const onPurchase = useCallback((upgrade: UpgradeResponse) => {
    addToast({ message: `Purchased: ${upgrade.name}` });
    setUpgrades((prev) => prev.map((x) => (x.id === upgrade.id ? upgrade : x)));
    EventSystem.fireEvent('PurchaseMade', upgrade.price);
  }, [addToast]);
  useEvent('OnUpgradePurchased', onPurchase);

  const purchase = useCallback((upgrade: UpgradeResponse) => {
    setLoading(true);
    ClickerService.purchaseUpgrade(upgrade.id).then(() => {
      setPlayer((prev) => prev && ({ ...prev, portalCount: prev.portalCount - upgrade.price }));
      setLoading(false);
    });
  }, [setPlayer]);

  return (
    <div className="bg-background-light w-1/5 relative">
      {loading && <LoadingIcon />}
      <div className="text-4xl font-bold p-4 text-center underline">Upgrades</div>
      {upgrades.map((upgrade, i) => (
        <Tooltip key={upgrade.id} text={upgrade.actionText}>
          {(ref) => (
            <div ref={ref} onClick={loading || (player?.portalCount ?? 0) < upgrade.price || upgrade.purchased ? undefined : () => purchase(upgrade)} className={`${(player?.portalCount ?? 0) < upgrade.price || upgrade.purchased ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} py-2 px-4 ${i !== 0 ? ' border-t border-white' : ''} transition-colors duration-300 hover:bg-white hover:bg-opacity-20 select-none`}>
              <div className="flex gap-4 justify-between">
                <div className="text-2xl font-semibold">
                  {upgrade.name}
                </div>
                {upgrade.purchased && <div className="text-xs uppercase mt-1">Purcahsed</div>}
              </div>
              <div>
                [
                <span className="font-mono">
                  {debugMode ? upgrade.price : formatPortals(upgrade.price)}
                </span>
                ]
                {' '}
                {upgrade.description}
              </div>
            </div>
          )}
        </Tooltip>
      ))}
    </div>
  );
};
