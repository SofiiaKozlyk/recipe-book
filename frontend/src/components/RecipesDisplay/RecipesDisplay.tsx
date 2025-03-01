import { Link } from "react-router-dom";
import { useRequest } from 'ahooks';
import styles from "./RecipesDisplay.module.css";
import { getAllRecipes } from "../../api/recipeActions";
import { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loading from "../Loading/Loading";

const RecipesDisplay = () => {
  const [recipes, setRecipes] = useState([]);
  const { loading, error, run: fetchRecipesAction } = useRequest(() => getAllRecipes(), {
    manual: true,
    onSuccess: (data) => {
      setRecipes(data);
    },
  });

  useEffect(() => {
    fetchRecipesAction();
  }, [fetchRecipesAction]);

  return (
    <div className={styles["recipes-container"]}>
      <h1>Рецепти</h1>

      {loading && <Loading />}

      {error && <ErrorMessage />}

      <div className={styles["recipes-grid"]}>
        {recipes.map((recipe: { id: number; title: string }) => (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} className={styles["recipe-card"]}>
            <p className={styles["recipe-title"]}>{recipe.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipesDisplay;