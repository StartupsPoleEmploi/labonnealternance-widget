// Inspired by : https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367

export const ACTIONS = {
    SET_JOB_LABEL: 'SET_JOB_LABEL',
    SET_JOBS_CHOSEN: 'SET_JOBS_CHOSEN',
    SET_LOCATION_CHOSEN: 'SET_LOCATION_CHOSEN',
    SET_JOB_SUGGESTIONS: 'SET_JOB_SUGGESTIONS',
    SET_STEP: 'SET_STEP',
}

export const WIDGET_STEPS = {
    HOME: '/home',
    SEARCH_JOB: '/search-job',
    FILTER_JOBS: '/filters-jobs',
    SEARCH_LOCATION: '/search-location',
    RESULTS: '/results'
};

const initialState = {
    jobText: '',
    jobSuggestions: undefined,
    jobsChosen: undefined,
    locationChosen: undefined,
    currentStep: WIDGET_STEPS.HOME
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_JOB_LABEL':
            return { ...state, jobText: action.data.jobText }

        case 'SET_JOB_SUGGESTIONS':
            // Limit to ten results
            const jobSuggestions = action.data.jobSuggestions.slice(1,10);
            return { ...state, jobSuggestions }

        case 'SET_JOBS_CHOSEN':
            return { ...state, jobsChosen: action.data.jobsChosen };

        case 'SET_LOCATION_CHOSEN':
            return { ...state, locationChosen: action.data.locationChosen };

        case 'SET_STEP':
            let stepExists =
                action.data.step === WIDGET_STEPS.HOME || action.data.step === WIDGET_STEPS.SEARCH_JOB || action.data.step === WIDGET_STEPS.SEARCH_LOCATION
                 || action.data.step === WIDGET_STEPS.FILTER_JOBS || action.data.step === WIDGET_STEPS.RESULTS;

            if(stepExists && action.data.step !== state.currentStep) {
                return { ...state, currentStep: action.data.step };
            }
            return state;

        default:
            return state;
    }
}