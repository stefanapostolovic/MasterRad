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

export const completeTestFromCourse = async (courseName, answers) => {
  try {
    const response = await apiClient.post(
      `/test/completeFromCourse`,
      {
        name: courseName,
        answers: answers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error while sending answers for the test from course: ",
      courseName
    );
    throw error;
  }
}

export const completeTestFromModule = async (moduleName, answers) => {
  try {
    const response = await apiClient.post(`/test/completeFromModule`, {
      name: moduleName,
      answers: answers,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error while sending answers for the test from module: ",
      moduleName
    );
    throw error;
  }
}

export const retakeTestFromCourse = async (courseName) => {
  try {
    const response = await apiClient.get(
      `/test/retakeFromCourse/${courseName}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error while retaking the test from course: ",
      courseName
    );
    throw error;
  }
}

export const retakeTestFromModule = async (moduleName) => {
  try {
    const response = await apiClient.get(
      `/test/retakeFromModule/${moduleName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error while retaking the test from module: ", moduleName);
    throw error;
  }
};