import axios from "axios";

export const setLoadingInterceptor = ({ showLoading, hideLoading }) => {
  //it will take showLoading and hideLoading functions we created in the loading context provider as the input from any of the component that use it
  axios.interceptors.request.use(
    (req) => {
      if (!(req.data instanceof FormData)) showLoading(); //we added this condition if (!(req.data instanceof FormData)) before showLoading() while
      //working with the Upload food image, where we dont want to show loader when an image upload is in progress,
      //rather we are showing the toast message for image upload progress from the frontend
      return req;
    },
    (error) => {
      hideLoading();
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      hideLoading();
      return res;
    },
    (error) => {
      hideLoading();
      return Promise.reject(error);
    }
  );
};

export default setLoadingInterceptor;
