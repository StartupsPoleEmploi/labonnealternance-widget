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
          <h1>Trouvez ici les 63 000 entreprises qui recrutent régulièrement en alternance</h1>
          <div className="button-container">
            <Link dispatchFn={this.props.dispatch} className="button" step={WIDGET_STEPS.SEARCH} title="Commencer à chercher">C'est parti</Link>
          </div>
        </div>
      </main>
    );
  }
}