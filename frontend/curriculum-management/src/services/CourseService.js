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

export const checkIfCourseIsComplete = async (courseName) => {
  try {
    const response = await apiClient.get(`/course/is_complete/${courseName}`);
    return response.data
  } catch (error) {
    console.error(`Error while checking whether the course ${courseName} is complete`)
    throw error
  }
}

export const checkIfCanAccessCourse = async (courseName) => {
  try {
    const response = await apiClient.get(`/course/can_access/${courseName}`)
    return response.data
  } catch (error) {
    console.error(
      `Error while checking whether the course ${courseName} can be accessed`
    );
    throw error;
  }
}

export const checkIfCanTakeTest = async (courseName) => {
  try {
    const response = await apiClient.get(`/course/can_take_test/${courseName}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error while checking whether the test can be taken for the course: ${courseName}`
    );
    throw error;
  }
};

export const getUserStatisticsForCourse = async (courseName) => {
  try {
    const response = await apiClient.get(
      `/testResult/userStatistics/${courseName}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error while fetcheng user statistics for the course: ${courseName}`
    );
    throw error;
  }
};