import {
  userSelectorIsAuthenticated,
  userSelectorIsLoading
} from '../services/slice/userSlice';
import { Preloader } from './ui/preloader';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(userSelectorIsAuthenticated);
  const isLoading = useSelector(userSelectorIsLoading);

  if (isLoading) {
    // пока идёт чекаут пользователя , показываем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && isAuthenticated) {
    //  если маршрут для неавторизованного пользователя, но пользователь авторизован
    return <Navigate replace to='/' />;
  }

  return children;
};
