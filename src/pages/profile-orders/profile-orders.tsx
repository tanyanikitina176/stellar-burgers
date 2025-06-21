import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyOrders,
  orderSelectorMyOrders,
  orderSelectorRequest
} from '../../services/slice/orderSlice';
import { AppDispatch } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(orderSelectorMyOrders);
  const isLoading = useSelector(orderSelectorRequest);
  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
