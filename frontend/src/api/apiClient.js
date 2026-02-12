    import axios from 'axios';

    const apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,

    });

    // Interceptor to add the JWT token to requests
    apiClient.interceptors.request.use(
      (config) => {
        // Do not add the token to public auth routes
        if (config.url.startsWith('/auth/')) {
          return config;
        }

        const state = JSON.parse(localStorage.getItem('state'));
        const token = state?.auth?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    export default apiClient;