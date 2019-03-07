import { h, Component } from "preact";
import { Link } from 'preact-router';

import Loader from "../generics/loader";
import { LBBService, RESULT_NUMBER } from "../../services/lbb-api.service";
import { isEmpty } from "../../services/helper";
import { CompanyItem } from "../generics/company";
import ErrorMessage from "../generics/error";

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

  componentWillReceiveProps(nextProps, nextState) {
    if(!isEmpty(this.state.results)) return;

    const store = nextProps.store;
    const lbaURL = LBBService.getInstance().computeLBaUrl(store.jobChosen, store.locationChosen);

    LBBService.getInstance().getResults(store.jobChosen, store.locationChosen)
      .then(results => this.setState({ results, requestOccuring: false, lbaURL }))
      .catch(() => this.setState({ requestError: true, requestOccuring: false }));
  }


  renderResults() {
    const companies = this.state.results.companies;
    const companyCount = this.state.results.companies_count;

    return (
      <div>
        { companies.map((company, index) => (index < RESULT_NUMBER && <CompanyItem company={company} />)) }
        <div className="link-container button">
          <a href={this.state.lbaURL}>Découvrez {companyCount - RESULT_NUMBER} autres entreprises sur La Bonne alternance</a>
        </div>
      </div>
    );
  }
  render({}, {requestOccuring, requestError, results }) {
    return (
      <main id="results">
        <div className="result-title">
          <h1>Résultats de votre recherche</h1>
          <Link href="/recherche" title="Retour à la page de recherche">Retour</Link>
        </div>
        <div>
          { requestOccuring ? <Loader /> : null }
          { !requestOccuring && requestError ? <ErrorMessage text="Erreur lors de la récupération des résultats. Veuillez réessayer ultérieurement." /> : null }
          { !requestOccuring && isEmpty(results.companies) ? <div>Pas de résultats trouvés pour votre recherche.</div> : null }
          { !requestOccuring && !isEmpty(results.companies) ? this.renderResults() : null }
        </div>
      </main>
    );
  }
}