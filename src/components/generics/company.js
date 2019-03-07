
import { h, Component } from 'preact';

export class CompanyItem extends Component {

    render() {
        const company = this.props.company;

        return (
            <div key={company.siret} className="company">
                <h2 className="title" >{company.name}</h2>
                <div className="distance"><img alt="" src="/assets/img/pink-arrow.svg" className="arrow"/>{company.distance} km du lieu de recherche</div>
                <div>{ this.props.company.naf_text ? <p>{company.naf_text}</p>:'' }</div>
            </div>
        );
    }
}
