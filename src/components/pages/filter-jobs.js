import { h, Component } from "preact";
import Link from "../generics/link";
import { WIDGET_STEPS, ACTIONS } from "../../services/store";
import ErrorMessage from "../generics/error";


export default class FilterJobs extends Component {

    constructor(props) {
        super(props);

        const jobsChosen = this.props.store.jobsChosen || [];


        this.state = {
            jobSuggestions: this.props.store.jobSuggestions,
            jobSelectedIndex: -1,
            jobsChosen,
            showNoJobSelected: false
        }
    }


    autocompleteJob = (e) => {
        const jobInputText = e.target.value;
        this.setState({ jobInputText, jobError: false, jobSelectedIndex: -1, jobSuggestions: [] });

        if (!jobInputText) return;

        LBBService.getInstance().getJobSuggestions(jobInputText)
            .then(jobSuggestions => this.setState({ jobSuggestions }))
            .catch(() => this.setState({ jobError: true }));
    }

    keyPressAutoCompleteJob = (e) => {
        if (e.key === 'Enter' || e.code === "ArrowDown" || e.code === "ArrowUp") {
            e.preventDefault();

            if (e.code === "ArrowDown" || e.code === "ArrowUp") this.setState({ jobSelectedIndex: computeNewIndex(e.code, this.state.jobSelectedIndex, this.state.jobSuggestions.length) });
            else if (e.key === 'Enter' && this.state.jobSelectedIndex !== -1) {
                const job = this.state.jobSuggestions[this.state.jobSelectedIndex];
                this.setState({ jobsChosen: job, jobInputText: job.label, jobSelectedIndex: -1, jobSuggestions: [] });
            }
        }
    }

    selectJob = (e) => {
        let li = e.target;
        while (li.tagName !== 'LI') li = li.parentNode;

        const rome = li.getAttribute('data-rome');
        const job = this.state.jobSuggestions.find(job => job.id === rome);

        const selected = this.state.jobsChosen.includes(job);

        let newSelectedJobs = this.state.jobsChosen;
        if (selected) newSelectedJobs = this.state.jobsChosen.filter(j => j.id !== job.id)
        else newSelectedJobs.push(job);

        this.setState({ jobsChosen: newSelectedJobs });
    }

    // VALIDATION
    submitForm = (e) => {
        e.preventDefault();

        if (this.state.jobsChosen.length === 0) {
            this.setState({ showNoJobSelected: true });
            return;
        }

        this.props.dispatch({ action: ACTIONS.SET_JOBS_CHOSEN, data: { jobsChosen: this.state.jobsChosen } });
        this.props.dispatch({ action: ACTIONS.SET_STEP, data: { step: WIDGET_STEPS.SEARCH_LOCATION } });
    }

    render(props, { jobSuggestions, jobSelectedIndex, jobsChosen, showNoJobSelected }) {

        return (
            <main id="filter-jobs">

                <h1>Sélectionnez les métiers qui vous intéressent</h1>

                <form method="POST" action={WIDGET_STEPS.RESULTS} onSubmit={this.submitForm}>
                    <ul className="suggestion" role="listbox">{
                        jobSuggestions.map((job, index) => {
                            const current = index === jobSelectedIndex;
                            const selected = jobsChosen.find(j => j.id === job.id) !== undefined;

                            return (
                                <li key={job.rome} className={current ? 'current rome-suggestion' : 'rome-suggestion'} role="option" aria-selected={current} aria-checked={selected} data-rome={job.id} onClick={this.selectJob}>
                                    <span className="label">{job.label}</span>
                                    <span className="cross">
                                        {selected ?
                                            <img src="https://labonnealternance.pole-emploi.fr/static/img/icons/check-active.svg" alt="" />
                                            : <img src="https://labonnealternance.pole-emploi.fr/static/img/icons/check-inactive.svg" alt="" />
                                        }
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    { showNoJobSelected ? <ErrorMessage text="Pour passer à l'étape suivante, vous devez choisir au moins un métier." /> : null }

                    <div class="submit-container">
                        <Link dispatchFn={this.props.dispatch} step={WIDGET_STEPS.SEARCH_JOB} title="Retour à la sélection du métier" className="return-link">Retour</Link>
                        <button id="submit" type="submit" class="button">Valider</button>
                    </div>
                </form>
            </main>
        );
    }
}