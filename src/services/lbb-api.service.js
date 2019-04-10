import { cleanTerm } from "./helper";

const HEADERS = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
const HEADERS_ESD = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export const RESULT_NUMBER = 3;


export const DOMAIN = 'https://labonnealternance.pole-emploi.fr';
const ESD_URL = 'https://api.emploi-store.fr/partenaire/labonnealternance/v1/company/?pageSize=3&page=1';
const SUGGEST_JOBS_URL = `${DOMAIN}/api/labonneboite/suggest_jobs?term=`;
const SUGGEST_CITY_URL = `${DOMAIN}/api/labonneboite/suggest_cities?term=`;
const GET_COMPANIES_URL = `${DOMAIN}/api/labonneboite/get_companies?page=1&pageSize=3&distance=60`;

class LBBServiceInstance {
    constructor({ widgetName, ESDToken, useESD, dispatchFn }) {
        this.widgetName = widgetName;
        if (useESD) {
            this.ESDToken = ESDToken;
            this.useESD = true;
            this.ESDHeaders = Object.assign(HEADERS_ESD, { 'Authorization': `Bearer ${ESDToken}` });
        } else {
            this.useESD = false;
        }
        this.dispatch = dispatchFn;
    }

    getJobSuggestions(term) {
        let url = `${SUGGEST_JOBS_URL}${cleanTerm(term)}&widget-name=${this.widgetName}`;

        return new Promise((resolve, reject) => {
            fetch(url, { headers: computeHeaders(HEADERS) })
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(romesObjects => {
                    if (!romesObjects) return;
                    resolve(romesObjects);
                })
                .catch(err => console.error(err));
        });
    }

    getLocationSuggestions(term) {
        let url = `${SUGGEST_CITY_URL}${cleanTerm(term)}&widget-name=${this.widgetName}`;

        return new Promise((resolve, reject) => {
            fetch(url, { headers: computeHeaders(HEADERS) })
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(romesObjects => {
                    if (!romesObjects) return;
                    resolve(romesObjects);
                })
                .catch(err => console.error(err));
        });
    }


    getResults(job, location) {
        return this.useESD ? this.getResultsFromESD(job, location) : this.getResultsFromLBA(job, location);
    }

    getResultsFromESD(job, location) {
        let url = ESD_URL;
        url = url.concat('&rome_codes=', job.id)
            .concat('&longitude=', location.longitude)
            .concat('&latitude=', location.latitude);

        return this.doRequest(url, this.ESDHeaders);
    }

    getResultsFromLBA(job, location) {
        let url = GET_COMPANIES_URL;
        url = url.concat('&romes=', job.id)
            .concat('&longitude=', location.longitude)
            .concat('&latitude=', location.latitude)
            .concat('&widget-name=', this.widgetName);

        return this.doRequest(url, HEADERS);
    }

    doRequest(url, headers) {
        return new Promise((resolve, reject) => {
            fetch(url, { headers: computeHeaders(headers) })
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(romesObjects => {
                    if (!romesObjects) return;
                    resolve(romesObjects);
                });
        });
    }

    computeLBaUrl(job, location) {
        return `${DOMAIN}/entreprises/${this.computeLBaUrlData(job, location)}`;
    }

    computeLBaUrlData(job, location) {
        return `${job.occupation}/${location.city}-${location.zipcode}/${job.occupation}?distance=60`;
    }
}


class LBBServiceFactory {

    constructor() {
        this.instance = null;
    }

    init(widgetName, ESDToken, dispatchFn) {
        this.instance = new LBBServiceInstance({ widgetName, ESDToken, dispatchFn, useESD: true }, true);
        Object.freeze(this.instance);
        return this.instance;
    }

    initWithoutESD(widgetName, dispatchFn) {
        this.instance = new LBBServiceInstance({ widgetName, dispatchFn, useESD: false });
        Object.freeze(this.instance);
        return this.instance;
    }

    getInstance() {
        if (!this.instance) throw new Error("LBB Service not initialized");
        return this.instance;
    }
}

// Export as singleton
const lbbService = new LBBServiceFactory();
export { lbbService as LBBService };



function computeHeaders(headersObj) {
    let headers = new Headers();
    Object.keys(headersObj).forEach(key => headers.append(key, headersObj[key]));
    return headers;
}

