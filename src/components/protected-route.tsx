import { useSelector } from '../services/store';
import {
  userSelectorIsAuthenticated,
  userSelectorIsLoading
} from '../services/slice/userSlice';
import { Preloader } from './ui/preloader';
import { Navigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  if (isLoading) {
    // пока идёт чекаут пользователя , показываем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    //  если маршрут для неавторизованного пользователя, но пользователь авторизован
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
