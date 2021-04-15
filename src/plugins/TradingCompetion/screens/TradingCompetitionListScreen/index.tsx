import * as React from 'react';
import { CompetitionList } from '../../containers';
import './TradingCompetionListScreen.css';
export const TradingCompetionListScreen: React.FC = () => {
    return (
        <React.Fragment>
            <div id="trading-competition-list" className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center">
                        <h1 className="trading-competition-list__title">Welcome to CircleEx Trading Competition!</h1>
                        <h2 className="trading-competition-list__subtitle">The starting point for the most promising projects the cryptocurrency space has to offer.</h2>
                    </div>
                </div>
                <div className="mt-3">
                    <CompetitionList />
                </div>
            </div>
        </React.Fragment>
    )
}

