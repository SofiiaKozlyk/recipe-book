import { UserLoginPropsI, UserRegisterPropsI } from "../types/User";
import axiosInstance from "./axiosInstance";

export const doLogin = async ({ username, password }: UserLoginPropsI) => {
  const response = await axiosInstance.post('/api/auth/login', {
    username: username,
    password: password
  });
  return response.data;
}

export const doRegister = async ({ username, email, password }: UserRegisterPropsI) => {
  const response = await axiosInstance.post('/users/register', {
    username: username,
    email: email,
    password: password
  });
  return response.data;
};

export const getUser = async (params: { id?: number; username?: string }) => {
  const response = await axiosInstance.get('/users', { params });
  return response.data;
};

export const updateUser = async (id: number, user: { username?: string, email?: string, password?: string }) => {
  const response = await axiosInstance.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  await axiosInstance.delete(`/users/${id}`);
};