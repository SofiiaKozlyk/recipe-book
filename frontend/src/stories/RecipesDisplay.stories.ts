import { Meta, StoryObj } from "@storybook/react";
import RecipesDisplay from "../components/RecipesDisplay/RecipesDisplay";
import { Recipe } from "../types/Recipe";
import { withRouter } from 'storybook-addon-react-router-v6';

const meta: Meta<typeof RecipesDisplay> = {
  title: "Components/RecipesDisplay", 
  component: RecipesDisplay,
  decorators: [withRouter],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RecipesDisplay>;

const mockRecipes: Recipe[] = [
    {
        id: 16,
        title: "Apple Charlotte",
        description: "To prepare apple charlotte, you will need...",
        ingredients: [
          {
            id: 42,
            product: {
              id: 13,
              name: "Apple",
              calories: 130,
            },
            amount: 100,
          },
        ],
      },
      {
        id: 17,
        title: "Chocolate Cake",
        description: "A delicious chocolate cake made from...",
        ingredients: [
          {
            id: 43,
            product: {
              id: 14,
              name: "Cocoa Powder",
              calories: 250,
            },
            amount: 50,
          },
        ],
      },
];

export const Default: Story = {
  args: {
    recipes: mockRecipes, 
  },
  decorators:
  [
    (Story) => (
        Story()
    ),
  ],
};

export const OneRecipe: Story = {
  args: {
    recipes: [mockRecipes[0]], 
  },
  decorators:
  [
    (Story) => (
        Story()
    ),
  ],
};

export const Empty: Story = {
  args: {
    recipes: [], 
  },
  decorators:
  [
    (Story) => (
        Story()
    ),
  ],
};