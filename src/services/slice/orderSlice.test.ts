import { jest, expect, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  getMyOrders,
  getOrderByNumber,
  getOrders,
  orderBurger
} from './orderSlice';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(),
  fetchWithRefresh: jest.fn(),
  orderBurgerApi: jest.fn(),
  getCookie: jest.fn(() => 'mock-access-token'),
  getFeedsApi: jest.fn(() =>
    Promise.resolve({
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тест',
          createdAt: '01.01.2010',
          updatedAt: '01.01.2010',
          number: 1,
          ingredients: ['id-1', 'id-2']
        }
      ],
      total: 2,
      totalToday: 2
    })
  ),
  getOrdersApi: jest.fn(() =>
    Promise.resolve({
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тест',
          createdAt: '01.01.2010',
          updatedAt: '01.01.2010',
          number: 1,
          ingredients: ['id-1', 'id-2']
        }
      ],
      total: 2,
      totalToday: 2
    })
  ),
  getOrderByNumberApi: jest.fn(() =>
    Promise.resolve({
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тест',
          createdAt: '01.01.2010',
          updatedAt: '01.01.2010',
          number: 123,
          ingredients: ['id-1', 'id-2']
        }
      ]
    })
  )
}));

import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('тест для слайса orderSlice', () => {
  test('тест  оформления заказа orderBurger', async () => {
    const expectedResult = {
      order: {
        _id: '1',
        status: 'done',
        name: 'Тест',
        createdAt: '01.01.2010',
        updatedAt: '01.01.2010',
        number: 1,
        ingredients: ['id-1', 'id-2']
      },
      name: 'Тестовый заказ',
      success: true
    };

    const mockOrder = ['id-1'];

    (
      orderBurgerApi as jest.MockedFunction<typeof orderBurgerApi>
    ).mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: { order: orderReducer }
    });

    const dispatchPromise = store.dispatch(orderBurger(mockOrder));

    expect(store.getState().order.orderRequest).toBe(true);

    await dispatchPromise;

    expect(store.getState().order.orderRequest).toBe(false);

    const { orderModalData } = store.getState().order;

    expect(orderModalData).toEqual(expectedResult.order);

    expect(orderBurgerApi).toHaveBeenCalledWith(mockOrder);
  });

  test('тест получения всех заказов getOrders', async () => {
    const expectedResult = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тест',
          createdAt: '01.01.2010',
          updatedAt: '01.01.2010',
          number: 1,
          ingredients: ['id-1', 'id-2']
        }
      ],
      total: 2,
      totalToday: 2
    };

    (getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockResolvedValue(
      expectedResult
    );

    const store = configureStore({
      reducer: { order: orderReducer }
    });

    const dispatchPromise = store.dispatch(getOrders());

    expect(store.getState().order.orderRequest).toBe(true);

    await dispatchPromise;

    expect(store.getState().order.orderRequest).toBe(false);

    const { orderAll } = store.getState().order;

    expect(orderAll).toEqual(expectedResult.orders);
  });

  test('тест получения своих заказов getMyOrders', async () => {
    const expectedResult = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тест',
          createdAt: '01.01.2010',
          updatedAt: '01.01.2010',
          number: 1,
          ingredients: ['id-1', 'id-2']
        }
      ],
      total: 2,
      totalToday: 2
    };

    (
      getOrdersApi as jest.MockedFunction<typeof getOrdersApi>
    ).mockResolvedValue(expectedResult.orders);

    const store = configureStore({
      reducer: { order: orderReducer }
    });

    const dispatchPromise = store.dispatch(getMyOrders());

    expect(store.getState().order.orderRequest).toBe(true);

    await dispatchPromise;

    expect(store.getState().order.orderRequest).toBe(false);

    const { myOrders } = store.getState().order;

    expect(myOrders).toEqual(expectedResult.orders);
  });

  test('тест получения заказов по его номеру getOrderByNumber', async () => {
    const expectedResult = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тест',
          createdAt: '01.01.2010',
          updatedAt: '01.01.2010',
          number: 123,
          ingredients: ['id-1', 'id-2']
        }
      ]
    };

    (
      getOrderByNumberApi as jest.MockedFunction<typeof getOrderByNumberApi>
    ).mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: { order: orderReducer }
    });

    const dispatchPromise = store.dispatch(getOrderByNumber(123));

    expect(store.getState().order.orderRequest).toBe(true);

    await dispatchPromise;

    expect(store.getState().order.orderRequest).toBe(false);

    const { currentOrder } = store.getState().order;

    expect(currentOrder).toEqual(expectedResult.orders[0]);
  });
});
