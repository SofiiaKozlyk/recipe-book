import axios from "axios";

const API_URL = 'http://localhost:5000';

export const getAllRecipes = async () => {
    const response = await axios.get(`${API_URL}/recipes`);
    console.log(response.data);
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

