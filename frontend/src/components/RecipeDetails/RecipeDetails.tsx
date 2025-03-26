import styles from "../../pages/RecipePage/RecipePage.module.css";
import { Recipe } from "../../types/Recipe";
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from "@mui/icons-material";

export interface RecipeDetailsProps {
  /**
   * The recipe data to display. If undefined, no recipe details will be shown.
   */
  recipe: Recipe | undefined;

  /**
   * Indicates whether the current user is the author of the recipe.
   * If `true`, edit and delete options will be available.
   */
  isAuthor: boolean;

  /**
   * Function to delete the recipe.
   * This function is called when the delete button is clicked.
   */
  deleteRecipeAction: () => void;

  /**
   * Indicates whether the recipe is currently being deleted.
   * When `true`, the delete button should be disabled.
   */
  deleting: boolean;

  /**
   * Function to handle the edit action.
   * This function is called when the edit button is clicked.
   */
  handleEdit: () => void;
}

/**
 * UI component for displaying recipe details.
 */
const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  isAuthor,
  deleteRecipeAction,
  deleting,
  handleEdit,
}) => {
  return (
    <>
      <div className={styles["title-container"]}>
        <h1 className={styles["title"]}>{recipe?.title}</h1>
        {isAuthor && (
          <div className={styles["buttons-container"]}>
            <button
              className={styles["delete-button"]}
              onClick={deleteRecipeAction}
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

      <h3 className={styles["ingredients-title"]}>Ingredients:</h3>
      <ul className={styles["ingredients-list"]}>
        {recipe?.ingredients.map((ingredient) => (
          <li key={ingredient.id} className={styles["ingredient-item"]}>
            <span className={styles["ingredient-name"]}>{ingredient.product.name}</span>
            <span className={styles["ingredient-amount"]}>{ingredient.amount}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RecipeDetails;