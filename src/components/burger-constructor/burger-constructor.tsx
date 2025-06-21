import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearConstructor,
  constructorSelector
} from '../../services/slice/constructorSlice';
import { userSelectorIsAuthenticated } from '../../services/slice/userSlice';
import { AppDispatch } from '../../services/store';
import {
  clearOrderData,
  orderBurger,
  orderSelectorData,
  orderSelectorRequest
} from '../../services/slice/orderSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(constructorSelector);
  const isAuthenticated = useSelector(userSelectorIsAuthenticated);
  const orderRequest = useSelector(orderSelectorRequest);
  const orderModalData = useSelector(orderSelectorData);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];

    dispatch(orderBurger(ingredientsId));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderData());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
