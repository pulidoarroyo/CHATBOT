import { getChatByChatIdApi } from "../api/getchatbychatid.api";
import type { ChatMessageApi } from "../api/getchatbychatid.api";
import type { Message } from "../components/MessageBubble";

export const getChatByChatIdService = async (
  chatId: number
): Promise<Message[]> => {
  const apiMessages: ChatMessageApi[] = await getChatByChatIdApi(chatId);

  const messages: Message[] = apiMessages.map((msg, index) => ({
    id: index + 1,
    role: msg.role === "model" ? "assistant" : "user",
    content: msg.parts?.[0]?.text ?? "",
    type: "text",
  }));

  return messages;
};