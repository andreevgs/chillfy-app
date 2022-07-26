import axiosInstance from "./api";

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            if(config.url !== '/auth/logout'){
                let accessToken = JSON.parse(localStorage.getItem('accessToken'));
                if (accessToken) {
                    config.headers["Authorization"] = 'Bearer ' + accessToken;  // for Spring Boot back-end
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            console.log(0);
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            console.log('111');
            if (originalConfig.url !== "/auth/signin" && err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    console.log('222');

                    originalConfig._retry = true;
                    let refreshTokenStored = JSON.parse(localStorage.getItem('refreshToken'));
                    try {
                        const rs = await axiosInstance.get("/auth/tokens", {
                            headers: {Authorization: 'Bearer: ' + refreshTokenStored},
                        });
                        console.log('rs', rs);
                        const { accessToken, refreshToken } = rs.data;

                        localStorage.setItem('accessToken', JSON.stringify(accessToken));
                        localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        console.log(_error);
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};

export default setup;