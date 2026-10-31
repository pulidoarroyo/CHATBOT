import { postchatApi } from "../api/postchat.api";
import type { PostchatParams, PostchatResponseDTO } from "../api/postchat.api";

export class ChatbotService {

  static async createChat(
    params: PostchatParams
  ): Promise<PostchatResponseDTO> {

    // Validaciones de dominio (frontend)
    if (!params.chatNombre.trim()) {
      throw new Error("El nombre del chat no puede estar vacío");
    }

    if (params.chatNombre.length > 50) {
      throw new Error("El nombre del chat excede el límite permitido");
    }

    // Orquestación del caso de uso
    return await postchatApi(params);
  }

}