import { apiClient } from "./client";

export interface PostchatParams{
    userId: number;
    chatNombre: string;
}

export interface PostchatResponseDTO{
    data: string;
}

export const postchatApi = async (
  params: PostchatParams
): Promise<PostchatResponseDTO> => {
  const { userId, chatNombre } = params;

  const response = await apiClient.post<PostchatResponseDTO>(
    `/chatbot/chat/postchat/${params.userId}`,
    {}, 
    {
      params: {
        chat_nombre: params.chatNombre,
      },
    }
  );
  return response.data;
};