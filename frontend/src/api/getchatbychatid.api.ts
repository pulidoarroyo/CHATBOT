import { apiClient } from "./client";

export interface ChatPart {
  text: string;
}

export interface ChatMessageApi {
  role: "user" | "model";
  parts: ChatPart[];
}

export const getChatByChatIdApi = async (
  chatId: number
): Promise<ChatMessageApi[]> => {
  const response = await apiClient.get<ChatMessageApi[]>(
    `/chatbot/chat/messages/${chatId}`
  );

  return response.data;
};