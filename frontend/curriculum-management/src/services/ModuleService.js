import apiClient from "./AxiosInstance";

export const getModuleByName = async (moduleName) => {
  try {
    const response = await apiClient.get(`/module/${moduleName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};