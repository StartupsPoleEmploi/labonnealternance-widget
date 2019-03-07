import { ACTIONS } from "../../services/store";

export default function Link({ step, title, children, className, dispatchFn }) {

    function goToStep(event) {
        event.preventDefault();

        let link = event.target;
        while(link.tagName !== 'A') link = link.parentNode;
        const toStep = link.getAttribute('href');

        dispatchFn({
            action: ACTIONS.SET_STEP,
            data: { step: toStep }
        });
    }

    return (
        <a href={step} title={title} className={className} onClick={goToStep}>{ children }</a>
    )
}