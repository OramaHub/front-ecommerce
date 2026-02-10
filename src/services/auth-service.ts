import api from "./api";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
}

export const authService = {
  login(email: string, password: string) {
    return api.post<LoginResponse>("/api/auth/login", { email, password });
  },

  register(data: RegisterData) {
    return api.post("/api/auth/register", data);
  },

  refresh(refreshToken: string) {
    return api.post<LoginResponse>("/api/auth/refresh", { refreshToken });
  },

  logout(refreshToken: string) {
    return api.post("/api/auth/logout", { refreshToken });
  },
};
