import { h, Component } from "preact";

import { LBBService } from "../../services/lbb-api.service";
import { isEmpty } from "../../services/helper";
import { ACTIONS, WIDGET_STEPS } from "../../services/store";
import ErrorMessage from "../generics/error";

export default class SearchJobs extends Component {

  constructor(props) {
    super(props);

    const jobText = this.props.store.jobText || '';

    this.state = { jobText, canShowNoResult: false }
  }

  autocompleteJob = (e) => {
    const jobText = e.target.value;
    this.setState({ jobText, canShowNoResult: false });

    this.props.dispatch({
      action: ACTIONS.SET_JOB_LABEL,
      data: { jobText }
    })

    if (!jobText) return;

    LBBService.getInstance().getJobSuggestions(jobText)
      .then(jobSuggestions => {
        this.props.dispatch({
          action: ACTIONS.SET_JOB_SUGGESTIONS,
          data: { jobSuggestions }
        })
      })
      .catch(() => this.setState({ jobError: true }));
  }

  // VALIDATION
  submitForm = (e) => {
    e.preventDefault();

    const jobSuggestions = this.props.store.jobSuggestions;

    if (isEmpty(jobSuggestions)) {
      this.setState({ canShowNoResult: true });
      return;
    }

    if (jobSuggestions.length === 1) {
      // only one job match => select it automatically and skip to location page
      this.setState({ jobsChosen: jobSuggestions });
      this.props.dispatch({ action: ACTIONS.SET_JOBS_CHOSEN, data: { jobsChosen: this.state.jobsChosen } });
      this.props.dispatch({ action: ACTIONS.SET_STEP, data: { step: WIDGET_STEPS.SEARCH_LOCATION } });
    } else {
      // several jobs match => go to job filter page to make user select a subset
      this.props.dispatch({ action: ACTIONS.SET_STEP, data: { step: WIDGET_STEPS.FILTER_JOBS } });
    }
  }

  // RENDER
  render({ }, { jobText, jobError, canShowNoResult }) {
    const jobSuggestions = this.props.store.jobSuggestions || [];
    const noResult = jobSuggestions.length === 0 && jobText.length > 2;

    return (
      <main id="search-jobs">
        <div>
          <h1 className="sr-only">Sélection du métier</h1>

          <form method="POST" action={WIDGET_STEPS.RESULTS} onSubmit={this.submitForm}>
            <div id="job-form-step">
              <h1><label for="job_input">Quel métier/formation/domaine cherchez-vous ?</label></h1>
              <input id="job-input" type="text" placeholder="Graphiste, maçon, second de cuisine..." onInput={this.autocompleteJob} value={jobText} onKeyDown={this.keyPressAutoCompleteJob} />
            </div>

            {jobError ? <ErrorMessage text="Erreur lors de la récupération des métiers" /> : null}
            {noResult && canShowNoResult ? <ErrorMessage text="Nous n'avons pas compris le métier que vous recherchez. Essayez avec une autre orthographe" /> : null}

            <div class="submit-container">
              <button id="submit" type="submit" class="button">Valider</button>
            </div>
          </form>

        </div>
      </main>
    );
  }
}