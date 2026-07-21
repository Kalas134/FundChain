import api from "../../../services/api"

export const login = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};

export const register = async (registerData) => {
    const response = await api.post("/auth/register", registerData)
    return response.data;
}

export const logout = () => {
    // JWTsms Zustand의 logout()에서 제거하도록 설계됨
    // 따라서 별도의 API 호출은 불필요.
} 