import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, CircularProgress, Autocomplete } from '@mui/material';
import { useRequest } from 'ahooks';
import { createRecipe, searchProducts } from '../../api/recipeActions';
import { Product } from '../../types/Product';
import styles from './AddRecipe.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

const AddRecipe = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState<{ id: string; productId: number; amount: number; name: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<{ title?: string; description?: string; ingredients?: string }>({});

    const navigate = useNavigate();

    const { data: products, loading } = useRequest<Product[], [string]>(() => (searchTerm ? searchProducts(searchTerm) : Promise.resolve([])), {
        refreshDeps: [searchTerm],
        debounceWait: 500,
    });

    const { runAsync: createRecipeRequest, loading: creating } = useRequest(createRecipe, {
        manual: true,
        onSuccess: () => navigate('/'),
    });

    const validate = () => {
        const newErrors: { title?: string; description?: string; ingredients?: string } = {};

        if (!title.trim()) newErrors.title = 'Назва рецепту не може бути порожньою';
        if (!description.trim()) newErrors.description = 'Опис рецепту не може бути порожнім';
        if (ingredients.length === 0) newErrors.ingredients = 'Додайте хоча б один інгредієнт';

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

        await createRecipeRequest({ title, description, ingredients: formattedIngredients });
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Додати новий рецепт</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Назва рецепту"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title}
                />
                <TextField
                    label="Опис рецепту"
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

                <Typography variant="h6">Додати інгредієнти:</Typography>
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
                    renderInput={(params) => <TextField {...params} label="Пошук продуктів" 
                    error={!!errors.ingredients}
                    helperText={errors.ingredients} />}
                />

                <div className={styles["ingredients-list"]}>
                    {ingredients.map((ingredient, index) => (
                        <div key={`${ingredient.id}`} className={styles["ingredient-item"]}>
                            <Typography className={styles["ingredient-name"]}>{ingredient.name}</Typography>
                            <TextField
                                label="Кількість (г)"
                                type="number"
                                className={styles["amount-input"]}
                                value={ingredient.amount}
                                onChange={(e) => {
                                    const newIngredients = [...ingredients];
                                    newIngredients[index].amount = Math.max(1, Number(e.target.value));
                                    setIngredients(newIngredients);
                                }}
                                inputProps={{ min: 1 }}
                            />
                            <button
                                className={styles["delete-button"]}
                                onClick={() => handleRemoveIngredient(index)}
                            >
                                <DeleteIcon fontSize="small" />
                            </button>
                        </div>
                    ))}
                </div>

                <Button variant="contained" type="submit" fullWidth disabled={creating}
                    sx={{ backgroundColor: "#4caf50", marginTop: 2 }}>
                    {creating ? <CircularProgress size={24} sx={{ color: "#4caf50" }} /> : 'Додати рецепт'}
                </Button>
            </form>
        </Container>
    );
};

export default AddRecipe;