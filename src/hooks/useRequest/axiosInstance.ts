import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const AxiosConfig: AxiosRequestConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  responseType: 'json',
};
const AxiosInstance = axios.create(AxiosConfig);
AxiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status !== 200 || !res.data) {
      throw 'error';
    }
    return res.data;
  },
  (err: AxiosError) => {
    throw err;
  }
);

export default AxiosInstance;
