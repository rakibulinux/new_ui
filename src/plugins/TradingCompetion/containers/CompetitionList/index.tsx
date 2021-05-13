import { message } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { competionListFetch, selectCompetionsList } from '../../../../modules';
import { CompetitionItem } from '../../components';
import './CompetitionList.css';

export const CompetitionList: React.FC = () => {
	// // Dispatch Fetch Wallets Of User Action
	const dispatch = useDispatch();
	const dispatchCompetitionListFetch = () => dispatch(competionListFetch());

	const competitions = useSelector(selectCompetionsList);

	React.useEffect(() => {
		// dispatch Active Competition List Fetch in one time
		dispatchCompetitionListFetch();
	}, []);

	React.useEffect(() => {
		if (competitions.loading) {
			message.loading('', 0);
		} else {
			message.destroy();
		}

		return () => {
			message.destroy();
		};
	}, [competitions.loading]);

	return (
		<div className="container-fluid">
			<div className="row mt-4 d-flex justify-content-center">
				{[...competitions.payload.ongoing].map(competition => (
					<div className="col-md-4 col-xl-3 col-sm-6">
						<CompetitionItem competition={competition} type="ongoing" />
					</div>
				))}
			</div>
			<div className="row mt-4 d-flex justify-content-center">
				{competitions.payload.upcoming.map(competition => (
					<div className="col-md-4 col-xl-3 col-sm-6">
						<CompetitionItem competition={competition} type="upcoming" />
					</div>
				))}
			</div>
			<div className="row mt-4 d-flex justify-content-center">
				{competitions.payload.ended.map(competition => (
					<div className="col-md-4 col-xl-3 col-sm-6">
						<CompetitionItem competition={competition} type="ended" />
					</div>
				))}
			</div>
		</div>
	);
};
