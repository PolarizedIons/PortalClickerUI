import { useSpring, animated } from 'react-spring';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { LoadingIcon } from '../shared/LoadingIcon';
import { ClickerService } from '../../services/ClickerService';
import { useToast } from '../shared/Toaster';
import { LeaderboardResponse } from '../../models/responses/LeaderboardResponse';
import { formatPortals } from '../../utils/NumberUtils';
import { Tooltip } from '../shared/Tooltip';

export const Leaderboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<LeaderboardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const addToast = useToast();
  const style = useSpring({ height: open ? `${window.innerHeight}px` : '48px' });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    ClickerService.getLeaderboard()
      .then((res) => {
        setUsers(res);
        setLoading(false);
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
      <div className="bg-background-light bg-opacity-40 relative text-2xl text-white py-4 px-6 overflow-y-auto" style={{ height: 'calc(100vh - 48px)' }}>
        {loading && <LoadingIcon />}
        {users.map((user, i) => (
          <div key={i}>
            {i + 1}
            .
            {' '}
            <Tooltip text={user.portalCount}>
              {(ref) => <span ref={ref} className="font-mono text-gray-400">{formatPortals(user.portalCount)}</span>}
            </Tooltip>
            {' '}
            {user.userName}
          </div>
        ))}
      </div>
      )}
    </animated.div>
  );
};
