import { apiClient } from "./client";

export interface promptRequestDTO {
    message: string;  
}

export interface promptResponseDTO {
    response: string;
}

export interface promptParams {
    chatId: number;
}

export const promptApi = async (
  params: promptParams,
  payload: promptRequestDTO
): Promise<promptResponseDTO> => {
  const response = await apiClient.post<promptResponseDTO>(
    `/chatbot/chat/FeedBackPromt/${params.chatId}`,
    payload
  );
  return response.data;
};