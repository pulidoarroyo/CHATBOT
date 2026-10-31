import { uploadFileApi } from "../api/uploadfile.api";
import type { UploadFileResponse } from "../api/uploadfile.api";

export const uploadFileService = async (
  chatId: number,
  file: File
): Promise<UploadFileResponse> => {

  try {
    const result = await uploadFileApi(chatId, file);
    return result;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }

};