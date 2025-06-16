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

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

// for getting friends;

export const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
}

export const getOutgoingFriendRequest = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-request");
    return response.data;
}

export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export const getfriendRequests = async () => {
    const response = await axiosInstance.get("/users/friend-request");
    return response.data;
}

export const acceptFriendRequest = async (requestId) => {
    console.log(requestId);
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`)
    return response.data;
}

export const getStreamToken = async () => {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
}