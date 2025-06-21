import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getOrders, orderSelectorAll } from '../../services/slice/orderSlice';
import { AppDispatch } from 'src/services/store';
import { fetchIngredients } from '../../services/slice/productSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getOrders());
    dispatch(fetchIngredients());
  }, [dispatch]);
  /** TODO: взять переменную из стора */
  const orders = useSelector(orderSelectorAll);

  const handleGetFeeds = () => {
    dispatch(getOrders());
  };

  if (!orders.length) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
