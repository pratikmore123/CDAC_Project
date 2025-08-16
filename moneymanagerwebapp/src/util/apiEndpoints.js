export const BASE_URL = "http://localhost:8080/api/v1.0";

export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    TEST: "/test",
    
    // Profile
    GET_USER_INFO: "/profile",
    
    // Categories
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    
    // Incomes
    GET_ALL_INCOMES: "/incomes",
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (id) => `/incomes/${id}`,
    CURRENT_MONTH_INCOMES: "/incomes/current-month",
    
    // Expenses
    GET_ALL_EXPENSES: "/expenses",
    ADD_EXPENSE: "/expenses",
    DELETE_EXPENSE: (id) => `/expenses/${id}`,
    CURRENT_MONTH_EXPENSES: "/expenses/current-month",
    
    // Dashboard
    DASHBOARD_DATA: "/dashboard",
    
    // Filters
    FILTER_TRANSACTIONS: "/transactions/filter"
};