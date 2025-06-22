import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';
import { nanoid } from 'nanoid';

interface IBurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient | null>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const id = nanoid(10);
      state.ingredients.push({ id, ...action.payload });
    },
    deleteIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clearConstructor(state) {
      state.ingredients = [];
      state.bun = null;
    }
  },
  extraReducers: (buider) => {
    buider;
  }
});

export const { setBun, addIngredient, deleteIngredient, clearConstructor } =
  constructorSlice.actions;
export default constructorSlice.reducer;

export const constructorSelector = (state: RootState) =>
  state.constructorBurger;
