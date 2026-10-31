import { promptApi } from "../api/prompt.api";
import type { promptRequestDTO } from "../api/prompt.api";
import type { promptParams } from "../api/prompt.api";

export const promptService = async (
    params: promptParams,
    userMessage: promptRequestDTO
) => {
    const response = await promptApi(params , userMessage);
    return {
        response: response.response,
  };
}
