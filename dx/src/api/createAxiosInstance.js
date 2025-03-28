import axios from 'axios';
import { useLoadingStore } from '@/stores/loadingStore';

const MIN_LOADING_DURATION = 300;

export function createAxiosInstance(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
  });

  let activeRequests = 0;
  let startTime = null;

  function endLoadingWithDelay() {
    const elapsed = Date.now() - (startTime || Date.now());
    const delay = Math.max(MIN_LOADING_DURATION - elapsed, 0);

    setTimeout(() => {
      activeRequests = Math.max(activeRequests - 1, 0);
      if (activeRequests === 0) {
        useLoadingStore().end();
        startTime = null;
      }
    }, delay);
  }

  instance.interceptors.request.use(
    config => {
      activeRequests++;
      if (activeRequests === 1) {
        startTime = Date.now();
        useLoadingStore().start();
      }

      return config;
    },
    error => {
      endLoadingWithDelay();
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      endLoadingWithDelay();
      return response;
    },
    error => {
      endLoadingWithDelay();
      return Promise.reject(error);
    }
  );

  return instance;
}
