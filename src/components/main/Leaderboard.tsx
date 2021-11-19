import { useSpring, animated } from 'react-spring';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { ClickerService } from '../../services/ClickerService';
import { useToast } from '../shared/Toaster';
import { LeaderboardResponse } from '../../models/responses/LeaderboardResponse';
import { formatPortals } from '../../utils/NumberUtils';
import { Tooltip } from '../shared/Tooltip';

export const Leaderboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<LeaderboardResponse[]>([]);
  const addToast = useToast();
  const style = useSpring({ height: open ? `${window.innerHeight}px` : '48px' });

  const fetchUsers = useCallback(() => {
    ClickerService.getLeaderboard()
      .then((res) => {
        setUsers(res);
      })
      .catch((err) => {
        addToast({ message: err?.response?.data ?? 'Unable to fetch items' });
      });
  }, [addToast]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      const timer = setInterval(() => fetchUsers(), 5000);
      return () => {
        setUsers([]);
        clearInterval(timer);
      };
    }

    return () => {};
  }, [fetchUsers, open]);

  return (
    <animated.div style={style} className="absolute left-0 right-0 bottom-0">
      <div onClick={() => setOpen((prev) => !prev)} className="bg-background-light h-12 cursor-pointer text-white font-semibold flex justify-center items-center bg-opacity-75">
        Leaderboard
      </div>
      {open && (
      <div className="bg-background-light bg-opacity-95 relative text-2xl text-white px-2 overflow-y-auto" style={{ height: 'calc(100vh - 48px)' }}>
        {users.map((user, i) => (
          <div key={i} className={`flex py-4 px-4 border-t ${i === 0 ? 'border-transparent' : 'border-white'}`}>
            <div className="w-8">
              {i + 1}
              .

            </div>
            <div className="flex-grow">
              <Tooltip text={user.portalCount}>
                {(ref) => <span ref={ref} className="font-mono text-gray-400">{formatPortals(user.portalCount)}</span>}
              </Tooltip>
              {' '}
              portals placed
            </div>
            <div className="flex-grow text-center">
              {user.userName}
            </div>
            <div className="flex-grow text-right">
              <Tooltip text={user.portalsPerSecond}>
                {(ref) => <span ref={ref} className="font-mono text-gray-400">{formatPortals(user.portalsPerSecond)}</span>}
              </Tooltip>
              {' '}
              portals per second
            </div>
          </div>
        ))}
      </div>
      )}
    </animated.div>
  );
};
