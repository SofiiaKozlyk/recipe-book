import { Link } from "react-router-dom";
import styles from "./RecipesDisplay.module.css";
import { Recipe } from '../../types/Recipe';

const RecipesDisplay: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
  return (
    <div className={styles["recipes-container"]}>
      <h1>Recipes</h1>

      {recipes.length === 0 ? (
        <p className={styles["no-results"]}>Nothing found</p>
      ) : (
        <div className={styles["recipes-grid"]}>
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className={styles["recipe-card"]}>
              <p className={styles["recipe-title"]}>{recipe.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesDisplay;