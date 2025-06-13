import { axiosInstance } from "../lib/axios";

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
}

export const me = async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
}

export const onboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}