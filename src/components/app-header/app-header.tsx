import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { userSelectorData } from '../../services/slice/userSlice';

export const AppHeader: FC = () => {
  const userData = useSelector(userSelectorData);
  const userName = userData?.name || '';

  return <AppHeaderUI userName={userName} />;
};
