import { loginApi } from "../api/auth.api";
import type { LoginRequestDTO } from "../api/auth.api";

export interface User {
  id_usuario: string;
  nombre: string;
  apellido: string;
}

export const loginService = async (
    credentials: LoginRequestDTO
) => {
  const response = await loginApi(credentials);

  const usuario: User = {
    id_usuario: response.info.id_usuario,
    nombre: response.info.nombre,
    apellido: response.info.apellido,
  };

  return {
    message: response.message,
    info: usuario,
  };
};