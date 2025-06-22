import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

interface IIngredientListState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientListState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при загрузке ингредиентов');
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // пример редьюсера для обновления продуктов
    setProducts(state, action: PayloadAction<TIngredient[]>) {
      state.ingredients = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

// Экспортируем редьюсер для store
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;

// Создаем селектор
export const productsSelectorIngredients = (state: RootState) =>
  state.products.ingredients;
export const productSelectorIsLoading = (state: RootState) =>
  state.products.isLoading;
