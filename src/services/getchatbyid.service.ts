import { getChatByIdApi } from "../api/getchatid.api";
import type { GetChatIdParams } from "../api/getchatid.api";

export const getChatByIdService = async (
    params: GetChatIdParams,
) => {
    const response = await getChatByIdApi(params);
    return {
        response: response,
  };
}