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
    LBBService.init(props.dataToken, this.dispatch);
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
