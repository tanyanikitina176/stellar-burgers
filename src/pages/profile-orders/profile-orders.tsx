import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getMyOrders,
  orderSelectorMyOrders,
  orderSelectorRequest
} from '../../services/slice/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { fetchIngredients } from '../../services/slice/productSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyOrders());
    dispatch(fetchIngredients());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(orderSelectorMyOrders);
  const isLoading = useSelector(orderSelectorRequest);
  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
