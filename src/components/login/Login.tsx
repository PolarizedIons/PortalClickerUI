import { FC, useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { LoggedInState } from '../../recoil/atoms/LoggedIn';
import { UserState } from '../../recoil/atoms/User';
import { SecurityService } from '../../services/SecurityService';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { useToast } from '../shared/Toaster';

export const Login: FC = () => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const addToast = useToast();

  const setUser = useSetRecoilState(UserState);
  const setLoggedIn = useSetRecoilState(LoggedInState);

  const changeMode = useCallback((value: typeof mode) => {
    setMode(value);
    setEmail('');
    setUsername('');
    setPassword('');
  }, []);

  const login = useCallback(() => {
    if (!username || !password) {
      addToast({ message: 'Enter a username and password!' });
      return;
    }

    SecurityService.login(username, password)
      .then((res) => {
        setUser(res);
        localStorage.setItem('user', JSON.stringify(res));
        setLoggedIn(true);
        addToast({ message: `Welcome back, ${res.userName}` });
      }).catch(() => {
        addToast({ message: 'Invalid email/password' });
      });
  }, [addToast, password, setLoggedIn, setUser, username]);

  const register = useCallback(() => {
    if (!email || !username || !password) {
      addToast({ message: 'Enter an email, username, and password!' });
      return;
    }

    SecurityService.register(email, username, password)
      .then((res) => {
        setUser(res);
        localStorage.setItem('user', JSON.stringify(res));
        setLoggedIn(true);
        addToast({ message: `Welcome, ${res.userName}` });
      }).catch((err) => {
        addToast({ message: err?.response?.data ?? 'Unable to log in' });
      });
  }, [addToast, email, password, setLoggedIn, setUser, username]);

  return (
    <div className="text-center flex justify-center items-center w-full">
      <div style={{ width: 300 }} className="flex flex-col gap-2">
        <div className="text-4xl">{mode === 'LOGIN' ? 'login' : 'register'}</div>
        {mode === 'REGISTER' && <Input value={email} onChange={setEmail} placeholder="email" onEnter={register} />}
        <Input value={username} onChange={setUsername} placeholder="username" onEnter={mode === 'LOGIN' ? login : register} />
        <Input type="password" value={password} onChange={setPassword} placeholder="password" onEnter={mode === 'LOGIN' ? login : register} />
        {mode === 'LOGIN'
        && (
        <div className="flex justify-between">
          <Button onClick={() => changeMode('REGISTER')} outlined>register</Button>
          <Button onClick={login}>submit</Button>
        </div>
        )}
        {mode === 'REGISTER'
        && (
        <div className="flex justify-between">
          <Button onClick={() => changeMode('LOGIN')} outlined>login</Button>
          <Button onClick={register}>register</Button>
        </div>
        )}
      </div>
    </div>
  );
};
