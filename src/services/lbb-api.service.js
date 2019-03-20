import { ACTIONS } from "./store";
import { cleanTerm } from "./helper";

const HEADERS = { 'Accept': 'application/json', 'Content-Type': 'application/json'}

export const RESULT_NUMBER = 3;


const DOMAIN = 'http://localhost:8000';
const SUGGEST_JOBS_URL = `${DOMAIN}/api/labonneboite/suggest_jobs?term=`;
const SUGGEST_CITY_URL = `${DOMAIN}/api/labonneboite/suggest_cities?term=`;
const GET_COMPANIES_URL = `${DOMAIN}/api/labonneboite/get_companies?page=1&pageSize=3&distance=60`;

class LBBServiceInstance {
    constructor(widgetName, dispatchFn) {
        this.widgetName = widgetName;
        this.dispatch = dispatchFn;
    }

    getJobSuggestions(term) {
        let url = `${SUGGEST_JOBS_URL}${cleanTerm(term)}&widget-name=${this.widgetName}`;

        return new Promise((resolve, reject) => {

            fetch(url, { headers: HEADERS, mode: 'cors' })
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(romesObjects => {
                    if (!romesObjects) return;
                    resolve(romesObjects);
                });
        });
    }


    getLocationSuggestions(term) {
        let url = `${SUGGEST_CITY_URL}${cleanTerm(term)}&widget-name=${this.widgetName}`;

        return new Promise((resolve, reject) => {
            fetch(url, HEADERS)
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(romesObjects => {
                    if (!romesObjects) return;
                    resolve(romesObjects);
                });
        });
    }


    getResults(job, location) {
        let url = GET_COMPANIES_URL;
        url = url.concat('&romes=', job.id)
        .concat('&longitude=', location.longitude)
        .concat('&latitude=', location.latitude)
        .concat('&widget-name=', this.widgetName);

        return new Promise((resolve, reject) => {
            fetch(url, HEADERS)
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
        return `https://labonnealternance.pole-emploi.fr/entreprises/${job.occupation}/${location.city}-${location.zipcode}/${job.occupation}`;
    }
}


class LBBServiceFactory {

    constructor() {
        this.instance = null;
    }

    init(widgetName, dispatchFn) {
        if(!widgetName) throw new Error("No widgetName or given");

        this.instance = new LBBServiceInstance(widgetName, dispatchFn);
        Object.freeze(this.instance);
        return this.instance;
    }

    getInstance() {
        if(!this.instance) throw new Error("LBB Service not initialized");
        return this.instance;
    }
}

// Export as singleton
const lbbService = new LBBServiceFactory();
export { lbbService  as LBBService };








const fakeJobs = [{"id": "D1406", "label": "Management en force de vente (Responsable des ventes, ...)", "value": "Management en force de vente (Responsable des ventes, ...)", "occupation": "management-en-force-de-vente", "score": 4.4}, {"id": "M1706", "label": "Promotion des ventes (Chef de promotion des ventes, ...)", "value": "Promotion des ventes (Chef de promotion des ventes, ...)", "occupation": "promotion-des-ventes", "score": 4.4}, {"id": "M1701", "label": "Administration des ventes (Responsable de l'exploitation des ventes, ...)", "value": "Administration des ventes (Responsable de l'exploitation des ventes, ...)", "occupation": "administration-des-ventes", "score": 4.4}, {"id": "D1501", "label": "Animation de vente (Animateur / Animatrice de vente, ...)", "value": "Animation de vente (Animateur / Animatrice de vente, ...)", "occupation": "animation-de-vente", "score": 4.4}, {"id": "D1404", "label": "Relation commerciale en vente de v\u00e9hicules (Technicien / Technicienne de la vente de motocycles, ...)", "value": "Relation commerciale en vente de v\u00e9hicules (Technicien / Technicienne de la vente de motocycles, ...)", "occupation": "relation-commerciale-en-vente-de-vehicules", "score": 3.7}, {"id": "G1303", "label": "Vente de voyages (Gestionnaire de point de vente voyages, ...)", "value": "Vente de voyages (Gestionnaire de point de vente voyages, ...)", "occupation": "vente-de-voyages", "score": 3.7}, {"id": "D1408", "label": "T\u00e9l\u00e9conseil et t\u00e9l\u00e9vente (Technicien / Technicienne de la vente \u00e0 distance, ...)", "value": "T\u00e9l\u00e9conseil et t\u00e9l\u00e9vente (Technicien / Technicienne de la vente \u00e0 distance, ...)", "occupation": "teleconseil-et-televente", "score": 3.7}, {"id": "D1209", "label": "Vente de v\u00e9g\u00e9taux (Fleuriste, ...)", "value": "Vente de v\u00e9g\u00e9taux (Fleuriste, ...)", "occupation": "vente-de-vegetaux", "score": 3.6}, {"id": "D1212", "label": "Vente en d\u00e9coration et \u00e9quipement du foyer (Droguiste, ...)", "value": "Vente en d\u00e9coration et \u00e9quipement du foyer (Droguiste, ...)", "occupation": "vente-en-decoration-et-equipement-du-foyer", "score": 3.1}, {"id": "D1211", "label": "Vente en articles de sport et loisirs (Buraliste, ...)", "value": "Vente en articles de sport et loisirs (Buraliste, ...)", "occupation": "vente-en-articles-de-sport-et-loisirs", "score": 3.1}]
const fakeLocation = [{"city": "nantes", "zipcode": "44000", "label": "Nantes (44000)", "latitude": 47.235456880128645, "longitude": -1.5498348824858057}, {"city": "nant", "zipcode": "12230", "label": "Nant (12230)", "latitude": 44.0294480807959, "longitude": 3.2957847156847966}, {"city": "nanterre", "zipcode": "92000", "label": "Nanterre (92000)", "latitude": 48.89658766763805, "longitude": 2.212289820004106}, {"city": "nanteuil", "zipcode": "79400", "label": "Nanteuil (79400)", "latitude": 46.423297077864234, "longitude": -0.15979864117383993}, {"city": "nantes-en-ratier", "zipcode": "38350", "label": "Nantes-en-Ratier (38350)", "latitude": 44.91950875672914, "longitude": 5.827494525012668}, {"city": "nantheuil", "zipcode": "24800", "label": "Nantheuil (24800)", "latitude": 45.425191275663536, "longitude": 0.9558586048894868}, {"city": "nantua", "zipcode": "01130", "label": "Nantua (01130)", "latitude": 46.15541755265105, "longitude": 5.608350728717566}, {"city": "nanton", "zipcode": "71240", "label": "Nanton (71240)", "latitude": 46.616056712712215, "longitude": 4.820157352952034}, {"city": "nantilly", "zipcode": "70100", "label": "Nantilly (70100)", "latitude": 47.46063976615337, "longitude": 5.533775887105379}, {"city": "nantoin", "zipcode": "38260", "label": "Nantoin (38260)", "latitude": 45.443068908039976, "longitude": 5.267931578251315}]

const fakeResults = {
    "companies": [
      {
        "address": "Service des ressources humaines, 76 RUE DES FRANCAIS LIBRES, 44200 NANTES", 
        "alternance": true, 
        "boosted": false, 
        "city": "NANTES", 
        "contact_mode": "Envoyer un CV et une lettre de motivation", 
        "distance": 3.2, 
        "email": "mgornati@bouyguestelecom.fr", 
        "headcount_text": "500 à 999 salariés", 
        "lat": 47.2067, 
        "lon": -1.54601, 
        "matched_rome_code": "D1212", 
        "matched_rome_label": "Vente en décoration et équipement du foyer", 
        "matched_rome_slug": "vente-en-decoration-et-equipement-du-foyer", 
        "naf": "6120Z", 
        "naf_text": "Télécommunications sans fil", 
        "name": "BOUYGUES TELECOM ENTREPRISES", 
        "phone": "0272206140", 
        "siret": "39748093000437", 
        "social_network": "", 
        "stars": 4.4, 
        "url": "https://labonnealternance.pole-emploi.fr/details-entreprises/39748093000437?utm_medium=web&utm_source=api__labonnealternance&utm_campaign=api__labonnealternance", 
        "website": ""
      }, 
      {
        "address": "Service des ressources humaines, 12 LE PORTEREAU, 44120 VERTOU", 
        "alternance": true, 
        "boosted": false, 
        "city": "VERTOU", 
        "contact_mode": "Se présenter spontanément", 
        "distance": 8.3, 
        "email": "", 
        "headcount_text": "100 à 199 salariés", 
        "lat": 47.1689, 
        "lon": -1.50045, 
        "matched_rome_code": "D1212", 
        "matched_rome_label": "Vente en décoration et équipement du foyer", 
        "matched_rome_slug": "vente-en-decoration-et-equipement-du-foyer", 
        "naf": "4759B", 
        "naf_text": "Commerce de détail d'autres équipements du foyer", 
        "name": "MAISONS DU MONDE", 
        "phone": "", 
        "siret": "38319665600078", 
        "social_network": "", 
        "stars": 3.0, 
        "url": "https://labonnealternance.pole-emploi.fr/details-entreprises/38319665600078?utm_medium=web&utm_source=api__labonnealternance&utm_campaign=api__labonnealternance", 
        "website": "http://recrutement.maisonsdumonde.com/postulez/offres-demploi/#page-fr/search/set-vacsearchfront_function_niv1-001/quel-type-poste-recherchez-vous-fonctions-siege"
      }, 
      {
        "address": "4 BOULEVARD LELASSEUR, 44000 NANTES", 
        "alternance": false, 
        "boosted": false, 
        "city": "NANTES", 
        "contact_mode": "Se présenter spontanément", 
        "distance": 1.3, 
        "email": "nantes@monceaufleurs.com", 
        "headcount_text": "3 à 5 salariés", 
        "lat": 47.2332, 
        "lon": -1.56624, 
        "matched_rome_code": "D1209", 
        "matched_rome_label": "Vente de végétaux", 
        "matched_rome_slug": "vente-de-vegetaux", 
        "naf": "4776Z", 
        "naf_text": "Commerce de détail de fleurs, plantes, graines, engrais, animaux de compagnie et aliments pour ces animaux en magasin spécialisé", 
        "name": "MONCEAU FLEURS", 
        "phone": "0240400505", 
        "siret": "44400096200043", 
        "social_network": "", 
        "stars": 2.7, 
        "url": "https://labonnealternance.pole-emploi.fr/details-entreprises/44400096200043?utm_medium=web&utm_source=api__labonnealternance&utm_campaign=api__labonnealternance", 
        "website": "http://www.monceaufleurs.com"
      }, 
    ], 
    "companies_count": 15, 
    "url": "https://labonneboite.pole-emploi.fr/?utm_medium=web&utm_source=api__labonnealternance&utm_campaign=api__labonnealternance"
  }