import { Link } from 'preact-router';

export default function Header() {
    return (
        <header>
            <Link href="/" title="Retour à l'accueil du widget">
                <img src="../assets/img/logo-noir-lba.svg" alt="La Bonne Alternance" />
            </Link>

            <a href="https://www.pole-emploi.fr/" rel="noreferrer noopener" target="_blank" title="Aller sur pole-emploi.fr (ouverture dans un nouvel onglet)">
                <img src="../assets/img/pole-emploi-couleur.svg" alt="Pôle Emploi" />
            </a>
        </header>
    )
}