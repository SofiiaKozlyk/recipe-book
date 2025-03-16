import { useParams, useNavigate } from 'react-router-dom';
import { deleteRecipe, getRecipeById } from '../../api/recipeActions';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import type { Recipe } from '../../types/Recipe';
import styles from "./RecipePage.module.css";
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from "@mui/icons-material";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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
                            <div className={styles["title-container"]}>
                                <h1 className={styles["title"]}>{recipe?.title}</h1>
                                {isAuthor && (
                                    <div className={styles["buttons-container"]}>
                                        <button
                                            className={styles["delete-button"]}
                                            onClick={() => deleteRecipeAction()}
                                            disabled={deleting}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </button>
                                        <button className={styles["edit-button"]} onClick={handleEdit}>
                                            <Edit className={styles["edit-icon"]} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={styles["description"]}>
                                {recipe?.description.split("\n").map((paragraph) => (
                                    <p key={crypto.randomUUID()}>{paragraph}</p>
                                ))}
                            </div>

                            <h3 className={styles["ingredients-title"]}>Інгредієнти:</h3>
                            <ul className={styles["ingredients-list"]}>
                                {recipe?.ingredients.map((ingredient) => (
                                    <li key={ingredient.id} className={styles["ingredient-item"]}>
                                        <span className={styles["ingredient-name"]}>{ingredient.product.name}</span>
                                        <span className={styles["ingredient-amount"]}>{ingredient.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
            </div>
        </>
    );
};

export default RecipePage;