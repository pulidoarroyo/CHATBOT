import { promptApi } from "../api/prompt.api";
import type { promptRequestDTO } from "../api/prompt.api";

export const promptService = async (
    userMessage: promptRequestDTO
) => {
    const response = await promptApi(userMessage);
    return {
        response: response.response,
  };
}
