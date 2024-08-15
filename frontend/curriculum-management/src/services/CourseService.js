import apiClient from "./AxiosInstance";

export const getAllCourses = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseByName = async (courseName) => {
  try {
    const response = await apiClient.get(`/course/${courseName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export const getAllCourseNames = async () => {
  try {
    const response = await apiClient.get('/courses');
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};