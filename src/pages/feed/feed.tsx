import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { getOrders, orderSelectorAll } from '../../services/slice/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slice/productSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

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
