import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../store';
import { getCookie, setCookie } from '../../utils/cookie';

interface IUserState {
  isAuthenticated: boolean;
  data: TUser | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: IUserState = {
  isAuthenticated: false,
  data: null,
  error: null,
  isLoading: false
};

export const checkUserAuth = createAsyncThunk<
  TUserResponse, // тип возвращаемых данных
  void, // тип аргумента
  { rejectValue: string } // тип значения при ошибке
>('user/checkUser', async (_, thunkAPI) => {
  if (getCookie('accessToken')) {
    try {
      const response = await getUserApi();
      if (!response?.success) {
        return thunkAPI.rejectWithValue('Ошибка not success');
      }
      return response;
    } catch (e) {
      return thunkAPI.rejectWithValue('Ошибка checkuserauth');
    }
  } else {
    return thunkAPI.rejectWithValue('Пустой accessToken');
  }
});

export const loginUser = createAsyncThunk<
  TAuthResponse, // тип возвращаемых данных
  TLoginData, // тип аргумента
  { rejectValue: string } // тип значения при ошибке
>('user/loginUser', async (loginData: TLoginData, thunkAPI) => {
  const data = await loginUserApi(loginData);
  if (!data?.success) {
    return thunkAPI.rejectWithValue('Ошибка авторизации');
  }
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
});

// Асинхронный thunk для регистрации пользователя
export const registerUser = createAsyncThunk<
  TAuthResponse, // тип возвращаемых данных
  TRegisterData, // тип аргумента
  { rejectValue: string } // тип значения при ошибке
>('user/registerUser', async (data: TRegisterData, thunkAPI) => {
  try {
    const result = await registerUserApi(data);
    if (result?.success) {
      const { accessToken, refreshToken } = result;
      localStorage.setItem('refreshToken', refreshToken);
      setCookie('accessToken', accessToken);
    }
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue('Ошибка при регистрации');
  }
});

export const updateUser = createAsyncThunk<
  { user: TUser }, // тип возвращаемых данных
  Partial<TRegisterData>, // тип аргумента (частичные данные для обновления)
  { rejectValue: string }
>('user/updateUser', async (updateData, thunkAPI) => {
  try {
    const response = await updateUserApi(updateData);
    if (response?.success) {
      return { user: response.user };
    } else {
      return thunkAPI.rejectWithValue('Ошибка при обновлении пользователя');
    }
  } catch (error) {
    return thunkAPI.rejectWithValue('Ошибка при обновлении пользователя');
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      setCookie('accessToken', '', { expires: -1 });
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при выходе из системы');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload ?? 'Произошла ошибка';
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.error = null;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка при обновлении';
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.data) {
          state.data = { ...state.data, ...action.payload.user };
        }
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка при выходе';
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'Ошибка авторизации';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.data = action.payload?.user;
        }
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'Ошибка авторизации';
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.data = action.payload?.user;
        }
      });
  }
});

export default userSlice.reducer;

export const userSelectorData = (state: RootState) => state.user.data;
export const userSelectorError = (state: RootState) => state.user.error;
export const userSelectorIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const userSelectorIsLoading = (state: RootState) => state.user.isLoading;
