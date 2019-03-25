import { h, Component } from "preact";
import Router from 'preact-router';

import Home from "./pages/home";
import Search from "./pages/search";
import Results from "./pages/results";
import Header from "./generics/header";
import { reducer } from "../services/store";
import { LBBService } from "../services/lbb-api.service";

require("../assets/style.css");

export default class App extends Component {
  constructor(props) {
    super(props);

    // Init the service
    if(props.dataEsdWidgetToken) {
      LBBService.init(props.dataEsdWidgetToken, this.dispatch);
    } else if(props.dataWidgetName) {
      // No ESD
      LBBService.initWithoutESD(props.dataWidgetName, this.dispatch);
    } else {
      // Error message
      throw new Error(`No data-esd-widget-token given. Exemple: <labonnealternance-widget data-esd-widget-token="XXX"></labonnealternance-widget>`)
    }



    Object.freeze(LBBService);

    this.state = { store: reducer(undefined, {}) }
  }

  dispatch = ({ action, data }) => {
    const newStore = reducer(this.state.store, { type: action, data });
    this.setState({ store: newStore });
  }

  render(props, { store }) {
    const extraProps = { dispatch: this.dispatch, store };

    return (
      <div class="content">
        <div>
          <Header />
          <Router>
            <Home path="/" {...extraProps} />
            <Search path="/recherche" {...extraProps} />
            <Results path="/resultats" {...extraProps} />
          </Router>
        </div>
      </div>
    );
  }
}
