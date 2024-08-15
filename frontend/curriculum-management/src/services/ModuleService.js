import apiClient from "./AxiosInstance";

export const getModuleByName = async (moduleName) => {
  try {
    const response = await apiClient.get(`/module/${moduleName}`);
    console.log(response.data.videos)
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};