import { apiClient } from "./client";

export interface UploadFileResponse {
  status: string;
  message: string;
  file_name: string;
  type: string;
  file_path: string;
}

export const uploadFileApi = async (
  chatId: number,
  file: File
): Promise<UploadFileResponse> => {

  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadFileResponse>(
    `/chatbot/chat/upload/${chatId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};