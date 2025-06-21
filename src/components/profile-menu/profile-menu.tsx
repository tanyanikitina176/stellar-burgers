import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/slice/userSlice';
import { AppDispatch } from 'src/services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
