import { registerApi } from "../api/register.api";
import type { RegisterRequestDTO } from "../api/register.api";

export interface UserRegister {
  id_usuario: number;  
  nombre: string;
  apellido: string;
  email: string;
}

export const registerService = async (
    userData: RegisterRequestDTO
) => {
    const response = await registerApi(userData); 

    const usuario: UserRegister = {
        id_usuario: response.user.id_usuario,
        nombre: response.user.nombre,
        apellido: response.user.apellido,
        email: response.user.email,
    };

    return {
        message: response.message,
        user: usuario,
  };
}