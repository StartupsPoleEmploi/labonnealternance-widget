import { h, Component } from "preact";
import Link from "../generics/link";
import { WIDGET_STEPS } from "../../services/store";

export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main id="home">
        <div>
          <h1>Boostez votre recherche, trouvez ici des entreprises qui recrutent souvent des alternants</h1>
          <div className="button-container">
            <Link dispatchFn={this.props.dispatch} className="button" step={WIDGET_STEPS.SEARCH_JOB} title="Commencer à chercher">
              C'est parti
            </Link>
          </div>
        </div>
      </main>
    );
  }
}