import axiosInstance from "./config";

export const getHomeContent = async () => {
  try {
    const responce = await axiosInstance.get("/public/get-homecontent");
    // console.log(responce);
    return responce.data;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};
