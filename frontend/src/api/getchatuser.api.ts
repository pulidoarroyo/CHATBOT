import { apiClient } from "./client";

export interface GetchatuserParams{
  userId: number;
}

export interface ChatDTO{
  id_chat: number;
  nombre: string;
  fk_usuario: number;
}

export interface ChatUserResponseDTO{
  usuario: number;
  data: ChatDTO[];
}

export const getChatsByUserApi = async (
  params: GetchatuserParams,
): Promise<ChatUserResponseDTO> => {

  const response = await apiClient.get<ChatUserResponseDTO>(
    `/chatbot/chat/user/${params.userId}`, 
    {}
  );
  return response.data;
};