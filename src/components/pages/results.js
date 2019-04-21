import { h, Component } from "preact";

import Loader from "../generics/loader";
import { LBBService, RESULT_NUMBER } from "../../services/lbb-api.service";
import { isEmpty } from "../../services/helper";
import { CompanyItem } from "../generics/company";
import ErrorMessage from "../generics/error";
import Link from "../generics/link";
import { WIDGET_STEPS } from "../../services/store";

export default class Results extends Component {

  constructor(props) {
    super(props);

    this.state = {
      requestOccuring: true,
      requestError: false,
      lbaURL: undefined,
      results: {}
    }
  }

  componentDidMount() {
    const store = this.props.store;

    const lbaURL = LBBService.getInstance().computeLBaUrl(store.jobText, store.jobsChosen, store.locationChosen);

    LBBService.getInstance().getResults(store.jobsChosen, store.locationChosen)
      .then(results => this.setState({ results, requestOccuring: false, lbaURL }))
      .catch(() => this.setState({ requestError: true, requestOccuring: false }));
  }

  renderResults() {
    const store = this.props.store;
    const companies = this.state.results.companies;
    const companyCount = this.state.results.companies_count;
    const entreprisesNumber = companyCount - RESULT_NUMBER;

    const extraData = {
      location: store.locationChosen,
      jobs: store.jobsChosen,
      jobText: store.jobText,
    }

    if (entreprisesNumber <= 0) {
      return (

        <div>
          {companies.map((company, index) => (index < RESULT_NUMBER && <CompanyItem company={company} {...extraData} />))}
          <div className="link-container">
            <a target="_blank" className="button" title="(Nouvelle fenêtre)" href={this.state.lbaURL}>Découvrez d’autres entreprises partout en France</a>
          </div>
        </div>
      );
    }


    return (
      <div>
        {companies.map((company, index) => (index < RESULT_NUMBER && <CompanyItem company={company} {...extraData} />))}
        <div className="link-container">
          <a target="_blank" className="button" title="(Nouvelle fenêtre)" href={this.state.lbaURL}>Découvrez {entreprisesNumber} {entreprisesNumber > 1 ? 'autres entreprises' : 'autre entreprise'}</a>
        </div>
      </div>
    );
  }
  render({ }, { requestOccuring, requestError, results }) {
    return (
      <main id="results">
        <div className="result-title">
          {requestOccuring ? <h1>Un instant, nous recherchons des entreprises</h1> : <h1>Résultats de votre recherche</h1>}
          {requestOccuring ? null : <Link dispatchFn={this.props.dispatch} step={WIDGET_STEPS.SEARCH_JOB} title="Retour à la page de recherche">Retour</Link>}
        </div>
        <div>
          {requestOccuring ? <Loader /> : null}
          {!requestOccuring && requestError ? <ErrorMessage text="Erreur lors de la récupération des résultats. Veuillez réessayer ultérieurement." /> : null}
          {!requestOccuring && isEmpty(results.companies) ?
            <div className="center">
              <div>Désolé, nous n’avons pas trouvé d’entreprises.</div>
              <Link dispatchFn={this.props.dispatch} className="button" step={WIDGET_STEPS.SEARCH}>
                Vous pouvez faire une nouvelle recherche
              </Link>

            </div> : null}
          {!requestOccuring && !isEmpty(results.companies) ? this.renderResults() : null}
        </div>
      </main>
    );
  }
}