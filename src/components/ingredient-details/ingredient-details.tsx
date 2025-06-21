import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { productsSelectorIngredients } from '../../services/slice/productSlice';

export const IngredientDetails: FC = () => {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const ingredients = useSelector(productsSelectorIngredients);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === ingredientId
  );
  if (!ingredientData) {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
