import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RecipeDetails from '../components/RecipeDetails/RecipeDetails';

const meta: Meta<typeof RecipeDetails> = {
  title: 'Components/RecipeDetails',
  component: RecipeDetails,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RecipeDetails>;

const mockRecipe = {
  id: 1,
  title: "Apple Pie",
  description: "A delicious apple pie recipe...",
  ingredients: [
    { id: 1, product: { id: 1, name: 'Apple', calories: 52 }, amount: 200 },
    { id: 2, product: { id: 2, name: 'Sugar', calories: 400 }, amount: 100 },
  ],
};

export const Default: Story = {
  args: {
    recipe: mockRecipe,
    isAuthor: false,
    deleteRecipeAction: action('deleteRecipe'),
    deleting: false,
    handleEdit: action('handleEdit'),
  },
};

export const WithAuthor: Story = {
  args: {
    recipe: mockRecipe,
    isAuthor: true,
    deleteRecipeAction: action('deleteRecipe'),
    deleting: false,
    handleEdit: action('handleEdit'),
  },
};