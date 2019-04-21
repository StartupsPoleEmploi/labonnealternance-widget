import { h, Component } from "preact";

import Link from "../generics/link";
import { computeNewIndex } from "../../services/helper";
import ErrorMessage from "../generics/error";
import { LBBService } from "../../services/lbb-api.service";
import { ACTIONS, WIDGET_STEPS } from "../../services/store";


export default class SearchLocation extends Component {

    constructor(props) {
        super(props);

        const locationChosen = this.props.store.locationChosen || undefined;

        this.state = {
            locationInputText: locationChosen ? locationChosen.label : '',
            locationSuggestions: [],
            locationError: false,
            locationLoading: false,
            locationSelectedIndex: -1,
            locationChosen
        }
    }

    autocompleteLocation = (e) => {
        const locationInputText = e.target.value;
        this.setState({ locationInputText, locationError: false, locationSelectedIndex: -1, locationSuggestions: [] });

        if (!locationInputText) return;

        LBBService.getInstance().getLocationSuggestions(locationInputText)
            .then(locationSuggestions => this.setState({ locationSuggestions }))
            .catch(() => this.setState({ locationError: true }));
    }

    keyPressAutoCompleteLocation = (e) => {
        if (e.key === 'Enter' || e.code === "ArrowDown" || e.code === "ArrowUp") {
            e.preventDefault();

            if (e.code === "ArrowDown" || e.code === "ArrowUp") this.setState({ locationSelectedIndex: computeNewIndex(e.code, this.state.locationSelectedIndex, this.state.locationSuggestions.length) });
            else if (e.key === 'Enter' && this.state.locationSelectedIndex !== -1) {
                const city = this.state.locationSuggestions[this.state.locationSelectedIndex];
                this.setState({ locationChosen: city, locationInputText: city.label, locationSelectedIndex: -1, locationSuggestions: [] });
            }
        }
    }

    selectCity = (e) => {
        const cityCode = e.target.getAttribute('data-city');

        const city = this.state.locationSuggestions.find(location => location.city === cityCode);
        this.setState({ locationChosen: city, locationInputText: city.label, locationSelectedIndex: -1, locationSuggestions: [] });
    }

    renderLocationSuggestion() {
        const { locationInputText, locationError, locationSuggestions, locationSelectedIndex } = this.state;

        if (locationError) return <ErrorMessage text="Erreur lors de la récupération des villes" />;;
        if (!locationInputText || locationSuggestions.length === 0) return null;

        return <ul className="suggestion" role="listbox">{
            locationSuggestions.map((city, index) => {
                const current = index === locationSelectedIndex;
                return (
                    <li key={city.city} className={current ? 'current' : ''} role="option" aria-selected={current} data-city={city.city} onClick={this.selectCity}>
                        {city.label}
                    </li>
                );
            })}</ul>;
    }

    submitForm = (e) => {
        e.preventDefault();

        const locationChosen = this.state.locationChosen || [];
        if (locationChosen.length === 0) return;

        this.props.dispatch({ action: ACTIONS.SET_LOCATION_CHOSEN, data: { locationChosen: this.state.locationChosen } });
        this.props.dispatch({ action: ACTIONS.SET_STEP, data: { step: WIDGET_STEPS.RESULTS } });
    }

    render() {
        const { locationInputText } = this.state;

        return (
            <main id="search-location">
                <div id="location-form-step">

                    <h1><label for="location-input">Où cherchez-vous votre entreprise ?</label></h1>

                    <form method="POST" action={WIDGET_STEPS.RESULTS} onSubmit={this.submitForm}>

                        <input id="location-input" type="text" placeholder="Ecrivez le nom de votre ville" value="" onInput={this.autocompleteLocation} value={locationInputText} onKeyDown={this.keyPressAutoCompleteLocation} />
                        {this.renderLocationSuggestion()}

                        <div class="submit-container">
                            <Link dispatchFn={this.props.dispatch} step={WIDGET_STEPS.FILTER_JOBS} title="Retour à la sélection des métiers" className="return-link">Retour</Link>
                            <button id="submit" type="submit" class="button">C'est parti !</button>
                        </div>
                    </form>
                </div>
            </main>
        );
    }
}