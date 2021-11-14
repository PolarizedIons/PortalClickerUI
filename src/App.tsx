import { FC, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Login } from './components/login/Login';
import { ItemsPanel } from './components/main/ItemsPanel';
import { MainPanel } from './components/main/MainPanel';
import { UpgradePanel } from './components/main/UpgradePanel';
import { LoggedInState } from './recoil/atoms/LoggedIn';
import { UserState } from './recoil/atoms/User';
import { SecurityService } from './services/SecurityService';

export const App: FC = () => {
  const [user, setUser] = useRecoilState(UserState);
  const [loggedIn, setLoggedIn] = useRecoilState(LoggedInState);

  useEffect(() => {
    if (user?.refreshToken) {
      SecurityService.refresh(user.userId, user.refreshToken)
        .then((res) => {
          setUser(res);
          localStorage.setItem('user', JSON.stringify(res));
          setLoggedIn(true);
        })
        .catch(() => {
          setUser(undefined);
          localStorage.removeItem('user');
          setLoggedIn(false);
        });
    }
  // Don't want to include refreshToken here :(
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoggedIn, setUser, user?.userId]);

  return (
    <div className="bg-background-dark text-foreground min-h-screen w-full flex">
      {user && loggedIn && (
      <>
        <UpgradePanel />
        <MainPanel />
        <ItemsPanel />
      </>
      )}
      {user && !loggedIn && <div>logging you in...</div>}
      {!user && !loggedIn && <Login />}
    </div>
  );
};
