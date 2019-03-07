// Inspired by : https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367

export const ACTIONS = {
    SET_AUTOCOMPLETE_VALUES: 'SET_AUTOCOMPLETE_VALUES',
    SET_RESULTS_DATA: 'SET_RESULTS_DATA',
}

const initialState = {
    jobChosen: undefined,
    locationChosen: undefined
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTOCOMPLETE_VALUES':
            return { ...state, jobChosen: action.data.jobChosen, locationChosen: action.data.locationChosen };

        default:
            return state;
    }
}