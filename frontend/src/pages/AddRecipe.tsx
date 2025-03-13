import { useNavigate } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { createRecipe } from '../api/recipeActions';
import RecipeForm from './RecipeForm/RecipeForm';

const AddRecipe = () => {
    const navigate = useNavigate();

    const { runAsync: createRecipeRequest, loading: creating } = useRequest(createRecipe, {
        manual: true,
        onSuccess: () => navigate('/'),
    });

    return (
        <RecipeForm recipeRequest={createRecipeRequest} />
    );
};

export default AddRecipe;