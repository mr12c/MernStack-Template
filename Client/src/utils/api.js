import axios from 'axios';
import { store } from '@/AppStore'; 
import { logout, updateTokens } from '../AppStore/authSlice';

const BASE_URL = 'http://localhost:9000';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

 
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        console.log(state)
        const token = state.AuthSlice.accessToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // If we have a refresh token, add it to headers
        const refreshToken = state.AuthSlice.refreshToken;
        if (refreshToken) {
            config.headers.AuthorizationRef = `Bearer ${refreshToken}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

         
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                
                const response = await axios.post(
                    `${BASE_URL}/api/v1/users/refreshToken`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            AuthorizationRef: `Bearer ${store.getState().AuthSlice.refreshToken}`
                        }
                    }
                );

                const { accessToken, refreshToken, user } = response.data.data;
                console.log("access token refresh successful")
                 
                store.dispatch(
                    updateTokens({
                        accessToken,
                        refreshToken
                    })
                );

                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                
                return api(originalRequest);
            } catch (refreshError) {
                console.log("logout due to both refreshToken and accessToken")
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

 
export const makeApiCall = async (endpoint, method = 'GET', data = null) => {
    try {
        const config = {
            method,
            url: endpoint,
            data: method !== 'GET' ? data : null,
            params: method === 'GET' ? data : null,
        };

        const response = await api(config);
        return response.data;
    } catch (error) {
       
        console.error('API call failed:', error);
        throw error;
    }
};

export default api;