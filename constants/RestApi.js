const _SERVER_BASE = __DEV__ ? "DEV_LINK" : "PROD_LINK";

export const Endpoints = {
    auth_login: `${_SERVER_BASE}/api/auth/login/`,
    auth_register: `${_SERVER_BASE}/api/auth/register/`,
    auth_check_token: `${_SERVER_BASE}/api/auth/check/`,
    job_post: `${_SERVER_BASE}/api/jobs/post/`,
    job_list: `${_SERVER_BASE}/api/jobs/list`,
    job_categories: `${_SERVER_BASE}/api/jobs/categories`,
    user_job_experience_update: `${_SERVER_BASE}/api/users/experience/`,
    user_info: `${_SERVER_BASE}/api/users/info/`,
    user_about_me_update: `${_SERVER_BASE}/api/users/about/`
};