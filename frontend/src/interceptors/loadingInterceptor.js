import axios from "axios";

export const setLoadingInterceptor = ({ showLoading, hideLoading }) => {
  //it will take showLoading and hideLoading functions we created in the loading context provider as the input from any of the component that use it
  axios.interceptors.request.use(
    (req) => {
      showLoading();
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
