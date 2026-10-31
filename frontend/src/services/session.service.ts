import { type User } from "../services/login.service";

export class SessionService {

  private static STORAGE_KEY = "auth_user";
  private static CHAT_ID_KEY = "chat_id";

  static getUser(): User {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      throw new Error("Sesión no encontrada");
    }

    return JSON.parse(data);
  }

  static getChatId(): number {
    const id_chat = localStorage.getItem(this.CHAT_ID_KEY);

    if (!id_chat) {
      throw new Error("Sesión no encontrada");
    }
    
    return parseInt(id_chat, 10);
  }

  static getUserId(): number {
    const usuario=this.getUser();
    const parseId=parseInt(usuario.id_usuario,10);
    return parseId;
  }

  /*static getUserId(): string {
    return this.getUser().id_usuario;
  }*/

  /*static getChatId(): number {
    return this.getUser().id_chat;
  }*/

}