import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { userSelectorData } from '../../services/slice/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userData = useSelector(userSelectorData);
  const userName = userData?.name || '';

  return <AppHeaderUI userName={userName} />;
};
