const initialState = {
    authToken: null,
    loginStatus: false,
    loginMessage: null,
    geolocation: {
        longitude: -1,
        latitude: -1
    },
    jobPostFailure: false,
    jobPostMessage: null,
    latestAction: "",
    data: null
};

const userReducer = (state=initialState, action) => {
    switch (action.type) {
        case "AUTH_LOGIN_SUCCESS": {
            return {...state, loginStatus: true, loginMessage: action.payload.loginMessage, authToken: action.payload.token, latestAction: "AUTH_LOGIN_SUCCESS"};
        }
        case "AUTH_LOGIN_FAILURE": {
            return {
                ...state,
                loginStatus: false,
                loginMessage: action.payload.loginMessage,
                latestAction: "AUTH_LOGIN_FAILURE"
            }
        }
        case "SET_USER_GEOLOCATION": {
            console.log(`Coordinates Changing to ${JSON.stringify(action.payload.geolocation)}`);

            return {
                ...state,
                geolocation: {...action.payload.geolocation},
                latestAction: "SET_USER_GEOLOCATION"
            }
        }
        case "JOB_POST_SUCCESS": {
            return {
                ...state,
                jobPostFailure: false, jobPostMessage: action.payload.message,
                latestAction: "JOB_POST_SUCCESS"
            }
        }
        case "JOB_POST_FAILURE": {
            return {
                ...state,
                jobPostFailure: true, jobPostMessage: action.payload.message,
                latestAction: "JOB_POST_FAILURE"
            }
        }
        case "UPDATE_USER_INFO": {
            return {
                ...state,
                data: action.payload.data,
                latestAction: "UPDATE_USER_INFO",
            }
        }
        case "UPDATE_USER_INFO_FAILURE": {
            return {
                ...state,
                data: null,
                latestAction: "UPDATE_USER_INFO_FAILURE"
            }
        }
    }

    return state;
};

//todo: include SET_EXPERIENCE_START, SET_EXPERIENCE_FINISH, SET_EXPERIENCE_ERROR

export default userReducer;