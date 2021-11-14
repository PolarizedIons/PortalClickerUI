import { FC, useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { LoggedInState } from '../../recoil/atoms/LoggedIn';
import { UserState } from '../../recoil/atoms/User';
import { SecurityService } from '../../services/SecurityService';

export const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const setUser = useSetRecoilState(UserState);
  const setLoggedIn = useSetRecoilState(LoggedInState);

  const login = useCallback(() => {
    SecurityService.login(username, password).then((res) => {
      setUser(res);
      localStorage.setItem('user', JSON.stringify(res));
      setLoggedIn(true);
    });
  }, [password, setLoggedIn, setUser, username]);

  return (
    <div className="text-center">
      <div className="text-4xl">login</div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="button" onClick={login}>submit</button>
    </div>
  );
};
