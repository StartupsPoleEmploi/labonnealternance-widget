import { h, Component } from "preact";

import Home from "./pages/home";
import Results from "./pages/results";
import Header from "./generics/header";
import SearchJobs from "./pages/select-jobs";
import SearchLocation from "./pages/select-location";
import FilterJobs from "./pages/filter-jobs";

import { reducer, WIDGET_STEPS } from "../services/store";
import { LBBService } from "../services/lbb-api.service";

require("../assets/style.css");

export default class App extends Component {
  constructor(props) {
    super(props);

    // Init the service
    if(props.dataEsdWidgetToken || props.dataEsdWidgetName) {
      if(!props.dataEsdWidgetName) throw new Error(`No data-esd-widget-name given. Exemple: <labonnealternance-widget data-esd-widget-name="XXX" data-esd-widget-token="XXX"></labonnealternance-widget>`)
      if(!props.dataEsdWidgetToken) throw new Error(`No data-esd-widget-token given. Exemple: <labonnealternance-widget data-esd-widget-name="XXX" data-esd-widget-token="XXX"></labonnealternance-widget>`)

      LBBService.init(props.dataEsdWidgetName, props.dataEsdWidgetToken, this.dispatch);
    } else if(props.dataWidgetName) {
      // No ESD
      LBBService.initWithoutESD(props.dataWidgetName, this.dispatch);
    } else {
      // Error message
      throw new Error(`No data-esd-widget-token given. Exemple: <labonnealternance-widget data-esd-widget-name="XXX" data-esd-widget-token="XXX"></labonnealternance-widget>`)
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
    const step = store.currentStep;

    return (
      <div class="content">
        <div>
          <Header dispatchFn={this.dispatch} />
          { step === WIDGET_STEPS.HOME ? <Home {...extraProps} /> : null }
          { step === WIDGET_STEPS.SEARCH_JOB ? <SearchJobs {...extraProps} /> : null }
          { step === WIDGET_STEPS.FILTER_JOBS ? <FilterJobs {...extraProps} /> : null }
          {step === WIDGET_STEPS.SEARCH_LOCATION ? <SearchLocation path="/recherche" {...extraProps} /> : null }
          { step === WIDGET_STEPS.RESULTS ? <Results path="/resultats" {...extraProps} /> : null }
        </div>
      </div>
    );
  }
}
