export type RecipeRequestMethod1 = (data: { 
    title: string; 
    description: string; 
    ingredients: { productId: number; amount: number }[] 
}) => void;

export type RecipeRequestMethod2 = (data: { 
    title: string; 
    description: string; 
    ingredients: { productId: number; amount: number }[] 
}, id: number) => void;

export type RecipeRequest = RecipeRequestMethod1 | RecipeRequestMethod2;