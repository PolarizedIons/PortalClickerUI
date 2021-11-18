import { FC, useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { LoggedInState } from '../../recoil/atoms/LoggedIn';
import { UserState } from '../../recoil/atoms/User';
import { SecurityService } from '../../services/SecurityService';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { useToast } from '../shared/Toaster';

export const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const addToast = useToast();

  const setUser = useSetRecoilState(UserState);
  const setLoggedIn = useSetRecoilState(LoggedInState);

  const login = useCallback(() => {
    if (!username || !password) {
      addToast({ message: 'Enter a username & password!' });
      return;
    }

    SecurityService.login(username, password)
      .then((res) => {
        setUser(res);
        localStorage.setItem('user', JSON.stringify(res));
        setLoggedIn(true);
      }).catch(() => {
        addToast({ message: 'Invalid email/password' });
      });
  }, [addToast, password, setLoggedIn, setUser, username]);

  return (
    <div className="text-center flex justify-center items-center w-full">
      <div style={{ width: 300 }} className="flex flex-col gap-2">
        <div className="text-4xl">login</div>
        <Input value={username} onChange={setUsername} placeholder="username" onEnter={login} />
        <Input type="password" value={password} onChange={setPassword} placeholder="password" onEnter={login} />
        <div className="flex justify-between">
          <Button onClick={login} outlined>register</Button>
          <Button onClick={login}>submit</Button>
        </div>
      </div>
    </div>
  );
};
