import { apiClient } from "./client";

export interface promptRequestDTO {
    message: string;  
}

export interface promptResponseDTO {
    response: string;
}

export const promptApi = async (
  payload: promptRequestDTO
): Promise<promptResponseDTO> => {
  const response = await apiClient.post<promptResponseDTO>(
    "/chatbot/chat/promt",
    payload
  );
  return response.data;
};