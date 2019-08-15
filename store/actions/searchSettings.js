export function addSearchCategory(category_id) {
    return {type: 'ADD_SEARCH_CATEGORY', payload: {id: category_id}}
}

export function removeSearchCategory(category_id) {
    return {type: 'REMOVE_SEARCH_CATEGORY', payload: {id: category_id}}
}

export function toggleSearchCategory(category_id) {
    return {type: 'TOGGLE_SEARCH_CATEGORY', payload: {id: category_id}}
}

export function setSearchRadius(kilometers) {
    return {type: 'SET_SEARCH_RADIUS', payload: {radius: kilometers}}
}

export function resetSearchSettings() {
    return {type: "RESET_SEARCH_CATEGORIES"}
}
