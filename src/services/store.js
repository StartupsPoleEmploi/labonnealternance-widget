// Inspired by : https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367

export const ACTIONS = {
    SET_AUTOCOMPLETE_VALUES: 'SET_AUTOCOMPLETE_VALUES',
    SET_STEP: 'SET_STEP',
}

export const WIDGET_STEPS = {
    HOME: '/home',
    SEARCH: '/search',
    RESULTS: '/results'
};

const initialState = {
    jobChosen: undefined,
    locationChosen: undefined,
    currentStep: WIDGET_STEPS.HOME
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTOCOMPLETE_VALUES':
            return { ...state, jobChosen: action.data.jobChosen, locationChosen: action.data.locationChosen };

        case 'SET_STEP':
            let stepExists = action.data.step === WIDGET_STEPS.HOME || action.data.step === WIDGET_STEPS.SEARCH || action.data.step === WIDGET_STEPS.RESULTS;
            if(stepExists && action.data.step !== state.currentStep) {
                return { ...state, currentStep: action.data.step };
            }
            return state;

        default:
            return state;
    }
}