import { apiClient } from "./client";

export interface RegisterRequestDTO {
    nombre: string;  
    apellido: string;
    email: string;
    password: string;
}

export interface UserRegisterDTO {
  id_usuario: number
  nombre: string;
  apellido: string;
  email: string;
}

export interface RegisterResponseDTO {
    message: string;
    user: UserRegisterDTO;
}

export const registerApi = async (
  payload: RegisterRequestDTO
): Promise<RegisterResponseDTO> => {
  const response = await apiClient.post<RegisterResponseDTO>(
    "/users/register",
    payload
  );
  return response.data;
};