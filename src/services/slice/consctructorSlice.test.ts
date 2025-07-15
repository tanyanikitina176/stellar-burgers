import { jest, expect, describe } from '@jest/globals';
import {
  clearConstructor,
  deleteIngredient,
  initialState,
  setBun
} from './constructorSlice';
import reducer from './constructorSlice';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mocked-id')
}));

import { nanoid } from 'nanoid';

beforeEach(() => {
  jest.clearAllMocks();
});

const mockIngredients = [
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
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
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
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

const mockBun = {
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
};

const expectedIngredient = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    id: 'mocked-id',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093c',
    id: 'mocked-id2',
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
  }
];

describe('тест для слайса constructorSlice', () => {
  test('корректное добавление ингредиентов в конструктор бургера', () => {
    const state = {
      ...initialState
    };
    const action = {
      type: 'constructorBurger/addIngredient',
      payload: mockIngredients[0]
    };
    const newState = reducer(state, action);
    expect(newState.ingredients[0]).toEqual(expectedIngredient[0]);
    expect(nanoid).toHaveBeenCalledTimes(1); // Проверяем вызов nanoid
  });

  test('корректное удаление ингредиентов в конструкторе бургера', () => {
    const state = {
      ...initialState,
      ingredients: [expectedIngredient[0]]
    };
    const action = {
      type: 'constructorBurger/deleteIngredient',
      payload: state.ingredients[0].id
    };
    const newState = reducer(state, action);
    expect(newState.ingredients).toEqual([]);
    expect(newState.bun).toBeNull();
  });
  test('корректное очищение конструктора бургера', () => {
    const state = {
      ...initialState,
      bun: expectedIngredient[1],
      ingredients: [expectedIngredient[0]]
    };
    const clearAction = clearConstructor();
    const clearedState = reducer(state, clearAction);
    expect(clearedState).toEqual(initialState);
    expect(state.bun).not.toBeNull();
    expect(state.ingredients.length).toBe(1);
  });

  test('корректное добавление булочки в конструктор бургера', () => {
    const action = setBun(mockIngredients[1]);
    const state = reducer(initialState, action);
    expect(state.bun).toEqual(mockBun);
  });
});
