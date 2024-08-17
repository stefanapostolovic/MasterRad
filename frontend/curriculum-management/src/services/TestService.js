import apiClient from "./AxiosInstance";

export const getTestByCourseName = async (courseName) => {
  try {
    const response = await apiClient.get(`/test/course/${courseName}`)
    return response.data
  } catch (error) {
    console.error("Error while fetching the test information for course: ", courseName)
    throw error
  }
}

export const getTestByModuleName = async (moduleName) => {
  try {
    const response = await apiClient.get(`/test/module/${moduleName}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error while fetching the test information for module: ",
      moduleName
    );
    throw error;
  }
}