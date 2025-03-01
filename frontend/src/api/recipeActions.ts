import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getAllRecipes = async () => {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
};

export const getRecipeById = async (id: number) => {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return response.data;
};

export const searchRecipes = async (title: string) => {
    const response = await axios.get(`${API_URL}/recipes/search?title=${title}`);
    return response.data;
};

