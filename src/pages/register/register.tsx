import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { registerUser } from '../../services/slice/userSlice';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      return;
    }
    dispatch(registerUser({ email, name: userName, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
