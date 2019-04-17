
import { h, Component } from 'preact';
import { DOMAIN, LBBService } from '../../services/lbb-api.service';

export class CompanyItem extends Component {

    render() {
        const company = this.props.company;

        const referer = LBBService.getInstance().computeLBaUrlData(this.props.jobText, this.props.jobs, this.props.location)
        const url = `${DOMAIN}/details-entreprises/${company.siret}?referer=${encodeURIComponent(`/entreprises/${referer}`)}&rome=${company.matched_rome_code}`

        return (
            <div key={company.siret} className="company">
                <h2 className="title" >
                    <a href={url} target="_blank" title={`Découvrir ${company.name} sur La Bonne Alternance`}>{company.name}</a>
                </h2>
                <div className="distance"><img alt="" src="https://labonnealternance.pole-emploi.fr/static/img/icons/pink-arrow.svg" className="arrow" />{company.distance} km du lieu de recherche</div>
                <div>{this.props.company.naf_text ? <p>{company.naf_text}</p> : ''}</div>
            </div>
        );
    }
}
