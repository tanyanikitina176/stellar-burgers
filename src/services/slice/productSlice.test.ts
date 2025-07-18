import { jest, expect, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchIngredients } from './productSlice';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

import { getIngredientsApi } from '@api';

describe('тест для слайса productSlice', () => {
  test('тест получения всех ингредиентов fetchIngredients', async () => {
    const expectedIngredients = [
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
      },
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      },
      {
        _id: '643d69a5c3f7b9001cfa0945',
        name: 'Соус с шипами Антарианского плоскоходца',
        type: 'sauce',
        proteins: 101,
        fat: 99,
        carbohydrates: 100,
        calories: 100,
        price: 88,
        image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
      }
    ];

    (
      getIngredientsApi as jest.MockedFunction<typeof getIngredientsApi>
    ).mockResolvedValue(expectedIngredients);

    const store = configureStore({
      reducer: { products: productReducer }
    });

    const dispatchPromise = store.dispatch(fetchIngredients());

    expect(store.getState().products.isLoading).toBe(true);

    await dispatchPromise;

    expect(store.getState().products.isLoading).toBe(false);

    const { ingredients } = store.getState().products;

    expect(ingredients).toEqual(expectedIngredients);
  });
});
