import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { editRecipe, getRecipeById } from './../api/recipeActions';
import { v4 as uuidv4 } from 'uuid';
import RecipeForm from '../components/RecipeForm/RecipeForm';
import { Ingredient } from './../types/Ingredient';
import { TransformedRecipe } from './../types/TransformedRecipe';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const [recipe, setRecipe] = useState<TransformedRecipe | null>(null);

  const navigate = useNavigate();

  const { runAsync: getRecipeRequest, loading: getting } = useRequest(
    () => getRecipeById(Number(id)),
    {
      manual: true,
      onSuccess: (data) => {
        if (data.user.id !== currentUserId) {
          navigate('/');
          return;
        }

        const transformedIngredients = data.ingredients.map((ingredient: Ingredient) => ({
          id: uuidv4(),
          productId: ingredient.product.id,
          amount: ingredient.amount,
          name: ingredient.product.name,
        }));

        setRecipe({
          ...data,
          ingredients: transformedIngredients,
        });

        console.log(data);
      },
    }
  );

  useEffect(() => {
    getRecipeRequest();
  }, [getRecipeRequest]);

  const { runAsync: editRecipeRequest, loading: editing } = useRequest(editRecipe, {
    manual: true,
    onSuccess: () => navigate(`/recipe/${id}`),
  });

  return recipe ? (
    <RecipeForm recipe={recipe} recipeRequest={editRecipeRequest} />
  ) : (
    <p>Loading...</p>
  );
};

export default EditRecipe;