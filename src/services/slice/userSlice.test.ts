import { jest, expect, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  checkUserAuth,
  initialState,
  loginUser,
  logout,
  registerUser,
  updateUser
} from './userSlice';

const mockUserData: TRegisterData = {
  email: 'test@test.ru',
  name: 'test',
  password: 'test_password'
};

const mockLoginData: TLoginData = {
  email: 'test@test.ru',
  password: 'test_password'
};

const mockUserDataWithoutPassword = {
  email: 'test@test.ru',
  name: 'test'
};

const updatedUserData = {
  email: 'newtest@test.ru',
  name: 'newtest'
};

const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = mockLocalStorage as unknown as Storage;

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(() => 'mock-token')
}));

jest.mock('@api', () => ({
  fetchWithRefresh: jest.fn(),
  registerUserApi: jest.fn(() => {
    const { email, name } = mockUserData;
    Promise.resolve({
      success: true,
      refreshToken: 'mock-refresh-token',
      accessToken: 'mock-token',
      user: { email, name }
    });
  }),
  loginUserApi: jest.fn(() => {
    Promise.resolve({
      succeess: true,
      refreshToken: 'mock-refresh-token',
      accessToken: 'mock-token',
      user: mockUserDataWithoutPassword
    });
  }),
  updateUserApi: jest.fn(() => {
    const { email, name } = updatedUserData;
    Promise.resolve({
      success: true,
      user: { email, name }
    });
  }),
  getUserApi: jest.fn(() => {
    Promise.resolve({
      success: true,
      user: mockUserDataWithoutPassword
    });
  }),
  logoutApi: jest.fn(() => {
    Promise.resolve({
      success: true
    });
  })
}));

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

describe('тест для слайса userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('тест регистрации пользователя registerUser', async () => {
    const { email, name } = mockUserData;
    const expectedAuthResponse = {
      success: true,
      refreshToken: 'mock-refresh-token',
      accessToken: 'mock-token',
      user: { email, name }
    };

    (
      registerUserApi as jest.MockedFunction<typeof registerUserApi>
    ).mockResolvedValue(expectedAuthResponse);

    const store = configureStore({
      reducer: { user: userReducer }
    });

    expect(store.getState().user).toEqual(initialState);

    const dispatchPromise = store.dispatch(registerUser(mockUserData));

    expect(store.getState().user.isLoading).toBe(true);

    await dispatchPromise;

    expect(store.getState().user.isLoading).toBe(false);

    expect(store.getState().user.isAuthenticated).toBe(true);

    expect(registerUserApi).toHaveBeenCalledWith(mockUserData);

    expect(store.getState().user.data).toEqual(expectedAuthResponse.user);
  });

  test('тест для обновления данных пользователя updateUser', async () => {
    const expectedUserResponse = {
      success: true,
      user: updatedUserData
    };

    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          ...initialState,
          isAuthenticated: true,
          data: {
            email: mockUserData.email,
            name: mockUserData.name
          }
        }
      }
    });

    (
      updateUserApi as jest.MockedFunction<typeof updateUserApi>
    ).mockResolvedValue(expectedUserResponse);

    const dispatchPromise = store.dispatch(updateUser(updatedUserData));

    expect(store.getState().user.isLoading).toBe(true);

    await dispatchPromise;

    expect(store.getState().user).toEqual({
      ...initialState,
      isLoading: false,
      isAuthenticated: true,
      data: updatedUserData
    });
  });

  test('тест для выхода пользователя из приложения logout', async () => {
    (logoutApi as jest.MockedFunction<typeof logoutApi>).mockResolvedValueOnce({
      success: true
    });

    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          ...initialState,
          isAuthenticated: true,
          data: {
            email: mockUserData.email,
            name: mockUserData.name
          }
        }
      }
    });

    const dispatchPromise = store.dispatch(logout());

    expect(store.getState().user.isLoading).toBe(true);

    await dispatchPromise;

    expect(store.getState().user).toEqual({
      ...initialState,
      isLoading: false,
      isAuthenticated: false,
      data: null
    });
  });

  test('тест для проверки входа пользователя в приложение loginUser', async () => {
    const { email, name } = mockUserData;
    const expectedLoginResponse = {
      success: true,
      refreshToken: 'mock-refresh-token',
      accessToken: 'mock-token',
      user: { email, name }
    };

    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          ...initialState,
          isAuthenticated: false,
          data: {
            email: mockUserData.email,
            name: mockUserData.name
          }
        }
      }
    });

    (
      loginUserApi as jest.MockedFunction<typeof loginUserApi>
    ).mockResolvedValue(expectedLoginResponse);

    const dispatchPromise = store.dispatch(loginUser(mockLoginData));

    expect(store.getState().user.isLoading).toBe(true);

    await dispatchPromise;

    expect(store.getState().user).toEqual({
      ...initialState,
      isLoading: false,
      isAuthenticated: true,
      data: mockUserDataWithoutPassword
    });
  });

  test('проверка авторизации пользователя checkUserAuth', async () => {
    const expectedCheckResponse = {
      success: true,
      user: mockUserDataWithoutPassword
    };

    (getUserApi as jest.MockedFunction<typeof getUserApi>).mockResolvedValue(
      expectedCheckResponse
    );

    const store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          ...initialState,
          isAuthenticated: false,
          data: {
            email: mockUserData.email,
            name: mockUserData.name
          }
        }
      }
    });

    const dispatchPromise = store.dispatch(checkUserAuth());

    expect(store.getState().user.isLoading).toBe(true);

    await dispatchPromise;

    expect(store.getState().user).toEqual({
      ...initialState,
      isLoading: false,
      isAuthenticated: true,
      data: mockUserDataWithoutPassword
    });
  });
});
