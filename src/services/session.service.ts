import { type User } from "../services/login.service";

export class SessionService {

  private static STORAGE_KEY = "auth_user";

  static getUser(): User {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      throw new Error("Sesión no encontrada");
    }

    return JSON.parse(data);
  }

  static getUserId(): string {
    return this.getUser().id_usuario;
  }

}