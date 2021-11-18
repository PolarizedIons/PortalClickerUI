import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { EventSystem } from '../../event-system/EventSystem';
import { useEvent } from '../../hooks/UseEvent';
import { ItemResponse } from '../../models/responses/ItemResponse';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { ClickerService } from '../../services/ClickerService';
import { formatPortals } from '../../utils/NumberUtils';
import { LoadingIcon } from '../shared/LoadingIcon';
import { useToast } from '../shared/Toaster';
import { Tooltip } from '../shared/Tooltip';

export const ItemsPanel: FC = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [player, setPlayer] = useRecoilState(PlayerState);
  const addToast = useToast();

  useEffect(() => {
    // *have to* use these in the effect for it to refetch them if they change
    if (player?.itemPriceMultiplier === 0 || player?.itemPortalMultiplier === 0) {
      // noop
    }
    setLoading(true);
    ClickerService.getItems().then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, [player?.itemPortalMultiplier, player?.itemPriceMultiplier]);

  const onPurchase = useCallback((item: ItemResponse) => {
    addToast({ message: `Purchased: ${item.name}` });
    setItems((prev) => prev.map((x) => (x.id === item.id ? item : x)));
  }, [addToast]);
  useEvent('OnItemPurchased', onPurchase);

  const purchase = useCallback((item: ItemResponse) => {
    setLoading(true);
    ClickerService.purchaseItem(item.id).then(() => {
      EventSystem.fireEvent('PurchaseMade', (item.cost * (player?.itemPriceMultiplier ?? 1)));
      setPlayer((prev) => prev && (
        {
          ...prev,
          portalCount: prev.portalCount - item.cost,
          portalsPerSecond: Math.floor((prev.portalsPerSecond + (item.portals * prev.itemPortalMultiplier)) * 10 ** 2) / 10 ** 2,
        }));

      setLoading(false);
    });
  }, [player?.itemPriceMultiplier, setPlayer]);

  return (
    <div className="bg-background-light w-1/5 relative">
      {loading && <LoadingIcon />}
      <div className="text-4xl font-bold p-4 text-center underline">Items</div>
      {items.map((item, i) => (
        <Tooltip key={item.id} text={`+${item.portals} portals per second`}>
          {(ref) => (
            <div ref={ref} onClick={loading || (player?.portalCount ?? 0) < item.cost ? undefined : () => purchase(item)} className={`${(player?.portalCount ?? 0) < item.cost ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} py-2 px-4 ${i !== 0 ? ' border-t border-white' : ''} transition-colors duration-300 hover:bg-white hover:bg-opacity-20 select-none`}>
              <div className="flex gap-4 justify-between">
                <div className="text-2xl font-semibold">
                  {item.name}
                </div>
                {item.amount > 0 && <div className="text-xs uppercase mt-1">{item.amount}</div>}
              </div>
              <div>
                [
                <span className="font-mono">
                  {formatPortals(item.cost)}
                </span>
                ]
                {' '}
                {item.description}
              </div>
            </div>
          )}
        </Tooltip>
      ))}
    </div>
  );
};
