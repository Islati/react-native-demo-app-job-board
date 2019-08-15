import axios from 'axios';
import {Endpoints}from '../../constants/RestApi';

export function getUserInfo(authToken) {
    return function(dispatch) {
        axios({
            url: Endpoints.user_info,
            method: 'GET',
            responseType: 'json',
            headers: {'Authorization': `Bearer ${authToken}`}
        }).then(response => {
            if (response.data.status !== "success") {
                dispatch({
                    type: 'UPDATE_USER_INFO_FAILURE'
                })
            } else {
                dispatch({
                    type: "UPDATE_USER_INFO",
                    payload: {
                        data: response.data.user
                    }
                })
            }
        }).catch(error => {
            dispatch({
                type: "UPDATE_USER_INFO_FAILURE"
            })
        })
    }
}

export function login(email, password) {
    return function(dispatch) {
        axios({
            url: Endpoints.auth_login,
            method: 'POST',
            responseType: 'json',
            data: {
                email: email,
                password: password
            }
        }).then(response => {

            if (response.data.status !== "success") {
                dispatch({
                    type: 'AUTH_LOGIN_FAILURE',
                    payload: {
                        loginMessage: response.data.message
                    }
                });
                return;
            }

            dispatch({type: 'AUTH_LOGIN_SUCCESS', payload: {
                token: response.data.token,
                loginMessage: response.data.message
            }})
        }).catch(error => {
            dispatch({type: 'AUTH_LOGIN_FAILURE', payload: {
                loginMessage: `Error Processing Login`,
            }})
        })
    }
}
export function postJob(title, description, longitude, latitude, job_type_name, category_name, authToken) {
    return function(dispatch) {
        console.log('POST JOB DISPATCH');
        axios({
            url: Endpoints.job_post,
            method: 'POST',
            responseType: 'json',
            data: {
                title: title,
                description: description,
                longitude: longitude,
                latitude: latitude,
                job_type: job_type_name,
                category: category_name,
            },
            headers: {'Authorization': `Bearer ${authToken}`}
        }).then(response => {
            console.log("POST JOB RESPONSE :: ");
            console.log(JSON.stringify(response.data));
            if (response.data.status !== "success") {
                dispatch({
                    type: 'JOB_POST_FAILURE',
                    payload: {
                        message: response.data.message
                    }
                });
                return;
            }

            dispatch({
                type: 'JOB_POST_SUCCESS',
                payload: {
                    message: response.data.message
                }
            })
        }).catch(error => {
            console.log(error);
            dispatch({
                type: 'JOB_POST_FAILURE',
                payload: {
                    message: 'Server Error'
                }
            })
        })
    }
}

export function updateGeolocation(longitude, latitude) {
    return {
        type: 'SET_USER_GEOLOCATION',
        payload: {
            geolocation: {
                longitude: longitude,
                latitude: latitude
            }
        }
    }
}



