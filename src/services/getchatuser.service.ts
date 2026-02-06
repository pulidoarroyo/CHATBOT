import { getChatsByUserApi } from "../api/getchatuser.api";
import type { GetchatuserParams } from "../api/getchatuser.api";

export const getChatByUserService = async (
    params: GetchatuserParams,
) => {
    const response = await getChatsByUserApi(params);
    return {
        response: response,
  };
}