import { UserLoginPropsI, UserRegisterPropsI } from "../types/User";
import axiosInstance from "./axiosInstance";

export const doLogin = async ({ username, password }: UserLoginPropsI) => {
  return await axiosInstance.post('/api/auth/login', {
    username: username,
    password: password
  });
}

export const doRegister = async ({ username, email, password }: UserRegisterPropsI) => {
  return await axiosInstance.post('/users/register', {
    username: username,
    email: email,
    password: password
  });
};

export const getUser = async (params: { id?: number; username?: string }) => {
  const response = await axiosInstance.get('/users', { params });
  return response.data;
};

export const doUpdate = async (id: number, user: { username?: string, email?: string, password?: string }) => {
  return await axiosInstance.put(`/users/${id}`, user);
};

export const doDelete = async (id: number) => {
  await axiosInstance.delete(`/users/${id}`);
};