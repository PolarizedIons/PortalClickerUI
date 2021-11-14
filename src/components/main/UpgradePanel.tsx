import { FC, useEffect, useState } from 'react';
import { UpgradeResponse } from '../../models/responses/UpgradeResponse';
import { ClickerService } from '../../services/ClickerService';

export const UpgradePanel: FC = () => {
  const [upgrades, setUpgrades] = useState<UpgradeResponse[]>([]);

  useEffect(() => {
    ClickerService.getUpgrades().then((res) => {
      setUpgrades(res);
    });
  }, []);

  return (
    <div className="bg-background-light w-1/5">
      {upgrades.map((upgrade) => (
        <div key={upgrade.id} className={`${upgrade.purchased ? 'opacity-60' : ''}`}>
          {upgrade.name}
        </div>
      ))}
    </div>
  );
};
