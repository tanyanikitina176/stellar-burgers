import { jest, expect, describe } from '@jest/globals';
import { rootReducer } from '../store';
import { initialState as constructorInitialState } from './constructorSlice';
import { initialState as userInitialState } from './userSlice';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: []
    })
  )
}));

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mocked-id')
}));

import { initialState as productInitialState } from './productSlice';
import { initialState as orderInitialState } from './orderSlice';

describe('Проверка правильной настройки и работы rootReducer', () => {
  test('При вызове с undefined состоянием и неизвестным экшеном возвращается начальное состояние', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    const expectedState = {
      constructorBurger: constructorInitialState,
      products: productInitialState,
      order: orderInitialState,
      user: userInitialState
    };

    expect(state).toEqual(expectedState);
  });
});
