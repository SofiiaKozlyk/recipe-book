import { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress, Autocomplete } from '@mui/material';
import { useRequest } from 'ahooks';
import { searchProducts } from '../../api/recipeActions';
import { Product } from '../../types/Product';
import styles from './RecipeForm.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { TransformedRecipe } from '../../types/TransformedRecipe';
import { RecipeRequest, RecipeRequestMethod1, RecipeRequestMethod2 } from '../../types/RecipeRequestMethod';
import { useLocation } from 'react-router-dom';

interface RecipeFormProps {
    recipe?: TransformedRecipe;
    recipeRequest: RecipeRequest;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, recipeRequest }) => {
    const location = useLocation();
    const isEditMode = location.pathname.includes("/edit/");
    
    const [title, setTitle] = useState(recipe?.title || '');
    const [description, setDescription] = useState(recipe?.description || '');
    const [ingredients, setIngredients] = useState<{ id: string; productId: number; amount: number; name: string }[]>(recipe?.ingredients || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<{ title?: string; description?: string; ingredients?: string }>({});


    const { data: products, loading } = useRequest<Product[], [string]>(() => (searchTerm ? searchProducts(searchTerm) : Promise.resolve([])), {
        refreshDeps: [searchTerm],
        debounceWait: 500,
    });

    const validate = () => {
        const newErrors: { title?: string; description?: string; ingredients?: string } = {};

        if (!title.trim()) newErrors.title = 'Recipe name cannot be empty';
        if (!description.trim()) newErrors.description = 'Recipe description cannot be empty';
        if (ingredients.length === 0) newErrors.ingredients = 'Add at least one ingredient';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const formattedIngredients = ingredients.map(({ productId, amount }) => ({
            productId,
            amount,
        }));

        if (recipe?.id !== undefined) {
            (recipeRequest as RecipeRequestMethod2)({ title, description, ingredients: formattedIngredients }, recipe.id);
        } else {
            (recipeRequest as RecipeRequestMethod1)({ title, description, ingredients: formattedIngredients });
        }
    };

    const handleRemoveIngredient = (id: string) => {
        setIngredients((prevIngredients) => 
            prevIngredients.filter((ingredient) => ingredient.id !== id)
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Add a new recipe</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Recipe title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title}
                />
                <TextField
                    label="Recipe description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description}
                />

                <Typography variant="h6">Add ingredients:</Typography>
                <Autocomplete
                    options={products || []}
                    getOptionLabel={(option) => option.name}
                    loading={loading}
                    onInputChange={(_, value) => setSearchTerm(value)}
                    onChange={(_, value) => {
                        if (value) {
                            setIngredients([...ingredients, { id: uuidv4(), productId: value.id, amount: 1, name: value.name }]);
                        }
                    }}
                    renderInput={(params) => <TextField {...params} label="Search products"
                        error={!!errors.ingredients}
                        helperText={errors.ingredients} />}
                />

                <div className={styles["ingredients-list"]}>
                    {ingredients.map((ingredient) => (
                        <div key={`${ingredient.id}`} className={styles["ingredient-item"]}>
                            <Typography className={styles["ingredient-name"]}>{ingredient.name}</Typography>
                            <TextField
                                label="Amount (g)"
                                type="number"
                                className={styles["amount-input"]}
                                value={ingredient.amount}
                                onChange={(e) => {
                                    const updatedIngredients = ingredients.map((item) =>
                                      item.id === ingredient.id
                                        ? { ...item, amount: Math.max(1, Number(e.target.value)) }
                                        : item
                                    );
                                    setIngredients(updatedIngredients);
                                  }}
                                inputProps={{ min: 1 }}
                            />
                            <button
                                className={styles["delete-button"]}
                                onClick={() => handleRemoveIngredient(ingredient.id)}
                            >
                                <DeleteIcon fontSize="small" />
                            </button>
                        </div>
                    ))}
                </div>

                <Button variant="contained" type="submit" fullWidth
                    sx={{ backgroundColor: "#4caf50", marginTop: 2 }}>
                        {isEditMode ? "Update Recipe" : "Add Recipe"}
                </Button>
            </form>
        </Container>
    );
};

export default RecipeForm;