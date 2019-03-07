import { h, Component } from "preact";

import { LBBService } from "../../services/lbb-api.service";
import { computeNewIndex, isEmpty } from "../../services/helper";
import { ACTIONS, WIDGET_STEPS } from "../../services/store";
import ErrorMessage from "../generics/error";

export default class Search extends Component {

  constructor(props) {
    super(props);

    const jobChosen = this.props.store.jobChosen || undefined;
    const locationChosen = this.props.store.locationChosen || undefined;

    this.state = {
      jobInputText: jobChosen ? jobChosen.label : '',
      jobSuggestions: [],
      jobError: false,
      jobSelectedIndex: -1,
      jobChosen,

      locationInputText: locationChosen ? locationChosen.label : '',
      locationSuggestions: [],
      locationError: false,
      locationLoading: false,
      locationSelectedIndex: -1,
      locationChosen
    }
  }

  // JOB
  autocompleteJob = (e) => {
    const jobInputText = e.target.value;
    this.setState({ jobInputText, jobError: false, jobSelectedIndex: -1, jobSuggestions: [] });

    if(!jobInputText) return;

    LBBService.getInstance().getJobSuggestions(jobInputText)
      .then(jobSuggestions => this.setState({ jobSuggestions }))
      .catch(() => this.setState({ jobError: true }));
  }

  keyPressAutoCompleteJob = (e) => {
    if(e.key === 'Enter' || e.code === "ArrowDown" || e.code === "ArrowUp") {
      e.preventDefault();

      if(e.code === "ArrowDown" || e.code === "ArrowUp") this.setState({ jobSelectedIndex : computeNewIndex(e.code, this.state.jobSelectedIndex, this.state.jobSuggestions.length )});
      else if (e.key === 'Enter' && this.state.jobSelectedIndex !== -1) {
        const job = this.state.jobSuggestions[this.state.jobSelectedIndex];
        this.setState({ jobChosen: job, jobInputText: job.label, jobSelectedIndex: -1, jobSuggestions: [] });
      }
    }
  }

  selectJob = (e) => {
    const rome = e.target.getAttribute('data-rome');
    const job = this.state.jobSuggestions.find(job => job.id === rome);
    this.setState({ jobChosen: job, jobInputText: job.label, jobSelectedIndex: -1, jobSuggestions: [] });
  }


  // LOCATION
  autocompleteLocation = (e) => {
    const locationInputText = e.target.value;
    this.setState({ locationInputText, locationError: false, locationSelectedIndex: -1, locationSuggestions: [] });

    if(!locationInputText) return;

    LBBService.getInstance().getLocationSuggestions(locationInputText)
      .then(locationSuggestions => this.setState({ locationSuggestions }))
      .catch(() => this.setState({locationError: true }));
  }

  keyPressAutoCompleteLocation = (e) => {
    if(e.key === 'Enter' || e.code === "ArrowDown" || e.code === "ArrowUp") {
      e.preventDefault();

      if(e.code === "ArrowDown" || e.code === "ArrowUp") this.setState({ locationSelectedIndex : computeNewIndex(e.code, this.state.locationSelectedIndex, this.state.locationSuggestions.length )});
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

  // VALIDATION
  submitForm = (e) => {
    e.preventDefault();

    const { jobChosen, locationChosen } = this.state;

    // SAVE values or display error
    if(isEmpty(jobChosen) || isEmpty(locationChosen)) return;

    this.props.dispatch({
      action: ACTIONS.SET_AUTOCOMPLETE_VALUES,
      data: { jobChosen, locationChosen }
    });

    // Go to result page
    this.props.dispatch({ action: ACTIONS.SET_STEP, data: { step: WIDGET_STEPS.RESULTS } });
  }


  // RENDER
  renderJobSuggestion() {
    const { jobInputText, jobError, jobSuggestions, jobSelectedIndex } = this.state;

    if(jobError) return <ErrorMessage text="Erreur lors de la récupération des métiers" />;
    if(!jobInputText || jobSuggestions.length === 0) return null;

    return <ul className="suggestion" role="listbox">{
      jobSuggestions.map((job, index) => {
        const current = index === jobSelectedIndex;
        return (
          <li key={job.rome} className={current ? 'current' : '' } role="option" aria-selected={current} data-rome={job.id} onClick={this.selectJob}>
            { job.label }
          </li>
        );
    })}</ul>;
  }
  renderLocationSuggestion() {
    const {locationInputText, locationError, locationSuggestions, locationSelectedIndex } = this.state;

    if(locationError) return <ErrorMessage text="Erreur lors de la récupération des villes" />;;
    if(!locationInputText || locationSuggestions.length === 0) return null;

    return <ul className="suggestion" role="listbox">{
      locationSuggestions.map((city, index) => {
        const current = index === locationSelectedIndex;
        return (
          <li key={city.city} className={current ? 'current' : '' } role="option" aria-selected={current} data-city={city.city} onClick={this.selectCity}>
            { city.label }
          </li>
        );
    })}</ul>;
  }
  render({}, { jobInputText, locationInputText }) {
    return (
      <main id="search">
        <div>
          <h1 className="sr-only">Rechercher une alternance</h1>

          <form method="POST" action={WIDGET_STEPS.RESULTS} onSubmit={this.submitForm}>
            <div id="job-form-step">
              <h2><label for="job_input">Dans quel métier/formation/domaine cherchez-vous ?</label></h2>
              <input id="job-input" type="text" placeholder="Graphiste, maçon, second de cuisine..." onInput={this.autocompleteJob} value={jobInputText} onKeyDown={this.keyPressAutoCompleteJob} />
            </div>
            { this.renderJobSuggestion() }


            <div id="location-form-step">
              <h2><label for="location-input">Où voulez-vous chercher votre future entreprise ?</label></h2>
              <input id="location-input" type="text" placeholder="Ecrivez le nom de votre ville" value="" onInput={this.autocompleteLocation} value={locationInputText} onKeyDown={this.keyPressAutoCompleteLocation} />
            </div>
            { this.renderLocationSuggestion() }

            <div class="submit-container">
              <button id="submit" type="submit" class="button">Rechercher une alternance</button>
            </div>
          </form>

        </div>
      </main>
    );
  }
}