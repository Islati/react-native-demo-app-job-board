const initialState = {
    selectedCategories: [],
    searchRadius: 20,
};

const searchSettingsReducer = (state=initialState, action) => {
    switch (action.type) {
        case "ADD_SEARCH_CATEGORY": {
            let newState = Object.assign({}, state);
            newState.selectedCategories.push(action.payload.id);
            return newState;
        }
        case "REMOVE_SEARCH_CATEGORY": {
            let newState = {...state};
            let category_id = action.payload.id;
            newState.selectedCategories = newState.selectedCategories.filter(id => id !== category_id);
            return newState
        }
        case "RESET_SEARCH_CATEGORIES": {
            let newState = {...state};

            newState.selectedCategories = [];
            return newState;
        }

        case "SET_SEARCH_RADIUS": {
            return {
                ...state,
                searchRadius: action.payload.searchRadius,
            }
        }

    }

    return state;
};

export default searchSettingsReducer;