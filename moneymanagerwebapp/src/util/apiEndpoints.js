export const BASE_URL = "http://localhost:8080/api/v1.0";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_INCOMES: "/incomes",
    DELETE_INCOME: (id) => `/incomes/${id}`,
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    GET_ALL_EXPENSES: "/expenses",
    ADD_INCOME: "/incomes"
};