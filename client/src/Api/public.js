import axiosInstance from "./config";

export const getHomeContent = async () => {
  try {
    const responce = await axiosInstance.get("/get-homecontent");
    return responce.data;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};
