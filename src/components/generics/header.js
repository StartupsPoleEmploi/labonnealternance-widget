import { WIDGET_STEPS } from "../../services/store";
import Link from "./link";

export default function Header({ dispatchFn }) {
    return (
        <header>
            <Link step={WIDGET_STEPS.HOME} title="Retour à l'accueil du widget" dispatchFn={dispatchFn}>
                <img src="http://labonnealternance.pole-emploi.fr/static/img/logo/logo-noir-lba.svg" alt="La Bonne Alternance" />
            </Link>

            <a href="https://www.pole-emploi.fr/" rel="noreferrer noopener" target="_blank" title="Aller sur pole-emploi.fr (ouverture dans un nouvel onglet)">
                <img src="http://labonnealternance.pole-emploi.fr/static/img/logo/pole-emploi-couleur.svg" alt="Pôle Emploi" />
            </a>
        </header>
    )
}