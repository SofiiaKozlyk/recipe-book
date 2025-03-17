// import axios from "axios";
import axiosInstance from "./axiosInstance";

// const API_URL = 'http://localhost:5000';

export const getAllRecipes = async () => {
    const response = await axiosInstance.get(`/recipes`);
    console.log(response.data);
    return response.data;
};

export const getRecipeById = async (id: number) => {
    const response = await axiosInstance.get(`/recipes/${id}`);
    return response.data;
};

export const searchRecipes = async (title: string) => {
    const response = await axiosInstance.get(`/recipes/search?title=${title}`);
    return response.data;
};

export const createRecipe = async (recipe: { title: string; description: string; ingredients: { productId: number; amount: number }[] }) => {
    const response = await axiosInstance.post(`/recipes`, recipe);
    return response.data;
};

export const editRecipe = async (recipe: { title?: string; description?: string; ingredients?: { productId: number; amount: number }[] }, id: number) => {
    const response = await axiosInstance.put(`/recipes/${id}`, recipe);
    return response.data;
};

export const deleteRecipe = async (id: number) => {
    await axiosInstance.delete(`/recipes/${id}`);
};

export const searchProducts = async (query: string) => {
    const { data } = await axiosInstance.get(`/products/search?name=${query}`);
    return data;
};