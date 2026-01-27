import { apiClient } from "./client";

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id_usuario: string;
  nombre: string;
  apellido: string;
}

export interface LoginResponseDTO {
  message: string;
  info: UserDTO;
}

export const loginApi = async (
  payload: LoginRequestDTO
): Promise<LoginResponseDTO> => {
  const response = await apiClient.post<LoginResponseDTO>(
    "/users/login",
    payload
  );
  return response.data;
};


