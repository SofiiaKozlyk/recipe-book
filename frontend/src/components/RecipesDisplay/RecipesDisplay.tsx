import { Link } from "react-router-dom";
import { useRequest } from 'ahooks';
import styles from "./RecipesDisplay.module.css";
import { getAllRecipes } from "../../api/recipeActions";
import { useEffect, useState } from "react";

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

      {loading && (
        <div className={styles["loading"]}>
          <div className={styles["spinner"]}></div>
          <p>Завантаження...</p>
        </div>
      )}

      {error && (
        <div className={styles["error-message"]}>
          <p>Щось пішло не так! Спробуйте ще раз.</p>
        </div>
      )}

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