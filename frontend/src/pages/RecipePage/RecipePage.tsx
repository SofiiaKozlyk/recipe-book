import { useParams, useNavigate } from 'react-router-dom';
import { deleteRecipe, getRecipeById } from '../../api/recipeActions';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import type { Recipe } from '../../types/Recipe';
import styles from "./RecipePage.module.css";
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import RecipeDetails from '../../components/RecipeDetails/RecipeDetails';

const RecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const currentUserId = useSelector((state: RootState) => state.user.userId);
    const [isAuthor, setIsAuthor] = useState(false);
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<Recipe>();
    const { loading, error, run: fetchRecipeAction } = useRequest(() => getRecipeById(Number(id)), {
        manual: true,
        onSuccess: (data) => {
            setIsAuthor(currentUserId === data.user.id);
            setRecipe(data);
        },
    });

    const { loading: deleting, run: deleteRecipeAction } = useRequest(() => deleteRecipe(Number(id)), {
        manual: true,
        onSuccess: () => {
            navigate('/');
        },
    });

    useEffect(() => {
        fetchRecipeAction();
    }, [fetchRecipeAction]);

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    return (
        <>
            <div className={styles["recipe-container"]}>
                {loading && <Loading />}

                {error && <ErrorMessage />}

                {!error && !loading &&
                    (
                        <>
                            <RecipeDetails
                                recipe={recipe}
                                isAuthor={isAuthor}
                                deleteRecipeAction={deleteRecipeAction}
                                deleting={deleting}
                                handleEdit={handleEdit}
                            />
                        </>
                    )}
            </div>
        </>
    );
};

export default RecipePage;