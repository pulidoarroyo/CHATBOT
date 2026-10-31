import { apiClient } from "./client";

export interface GetChatIdParams {
    chat_id: number;
}

export interface FeedbackChat{
    fecha: string;
    contenido: string;
    contenido_ia: string;
}

export interface GetChatIdResponseDTO {
    data: FeedbackChat[];
}

export const getChatByIdApi = async (
  params: GetChatIdParams
): Promise<GetChatIdResponseDTO> => {
  const { chat_id } = params;  

  const response = await apiClient.post<GetChatIdResponseDTO>(
    `/chatbot/chat/messages/${chat_id}`,
    {
        chat_id: chat_id
    }
  );
  return response.data;
};