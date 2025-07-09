import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface TOrderData {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orderAll: TOrder[];
  currentOrder: TOrder | null;
  feedOrder: Pick<TFeedsResponse, 'total' | 'totalToday'>;
  myOrders: TOrder[];
}

const initialState: TOrderData = {
  orderModalData: null,
  orderRequest: false,
  orderAll: [],
  currentOrder: null,
  feedOrder: {
    total: 0,
    totalToday: 0
  },
  myOrders: []
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredientsIds: string[], thunkAPI) => {
    try {
      const data = await orderBurgerApi(ingredientsIds);
      if (!data.success) {
        return thunkAPI.rejectWithValue('Ошибка при отправке заказа');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при отправке заказа');
    }
  }
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (_, thunkAPI) => {
    try {
      const orders = await getFeedsApi();
      if (!orders.success) {
        return thunkAPI.rejectWithValue('Ошибка при получении всех заказов');
      }
      return orders;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при получении всех заказов');
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number, thunkAPI) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (!response.success) {
        return thunkAPI.rejectWithValue(
          'Ошибка при получении заказа по номеру'
        );
      }

      return response.orders.length ? response.orders[0] : null;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при получении заказа по номеру');
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, thunkAPI) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при получении моих заказов');
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData(state) {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(getOrders.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getOrders.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderAll = action.payload.orders;
        state.feedOrder.total = action.payload.total;
        state.feedOrder.totalToday = action.payload.totalToday;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getMyOrders.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.myOrders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload;
      });
  }
});

export default orderSlice.reducer;
export const { clearOrderData } = orderSlice.actions;
export const orderSelectorData = (state: RootState) =>
  state.order.orderModalData;
export const orderSelectorRequest = (state: RootState) =>
  state.order.orderRequest;
export const orderSelectorAll = (state: RootState) => state.order.orderAll;
export const orderSelectorFeedOrder = (state: RootState) =>
  state.order.feedOrder;
export const orderSelectorMyOrders = (state: RootState) => state.order.myOrders;
export const orderSelectorCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
