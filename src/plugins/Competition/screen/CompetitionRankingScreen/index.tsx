import { TableAwards } from 'plugins/Competition/components';
import { RankingCompetition } from 'plugins/Competition/containers/RankingCompetition';
import React from 'react';
import { useParams } from 'react-router';

export const CompetitionRankingScreen = () => {
	const { competition_id } = useParams<{ competition_id: string }>();
	console.log(competition_id);

	const renderInfoItem = (key: string, value: string) => (
		<div className="competition-ranking-detail__info__update">
			<div className="competition-ranking-detail__info__update__title">
				<p>{key}</p>
			</div>
			<div className="competition-ranking-detail__info__update__value">
				<p>{value}</p>
			</div>
		</div>
	);

	return (
		<div id="competition-ranking-screen" className="container">
			<div className="competition-ranking-detail d-flex flex-column justify-content-center">
				<div className="competition-ranking-detail__title text-center">
					<h4>Become a winner and get a prize</h4>
				</div>
				<div className="competition-ranking-detail__description text-center m-auto">
					<p>
						Trade CX and win. The one who trades the largest volume will receive the main prize! Condition: buy or
						sell CX!
					</p>
				</div>
				<div className="competition-ranking-detail__info d-flex flex-wrap">
					<div className="col-md-6 row">
						<div className="col-md-6">
							{renderInfoItem('Your Trade volume', '0.000')}
							{renderInfoItem('Your Trade volume', '0.000')}
						</div>
						<div className="col-md-6">
							{renderInfoItem('Start Time', '2021-03-30 07:00')}
							{renderInfoItem('Start Time', '2021-03-30 07:00')}
						</div>
					</div>
					<div className="col-md-6 d-flex flex-column justify-content-center">
						<select className="competition-ranking-detail__info__selection">
							<option selected>Trade</option>
							<option value={1}>One</option>
							<option value={2}>Two</option>
							<option value={3}>Three</option>
						</select>
						<div className="d-flex justify-content-center">
							<button className="competition-ranking-detail__info__forward">Let's Trade</button>
						</div>
					</div>
				</div>
			</div>

			<div className="competition-ranking-awards row mt-5">
				<div className="col-md-6 col-sm-12">
					<TableAwards />
				</div>
				<div className="col-md-6 col-sm-12">
					<TableAwards />
				</div>
			</div>
			<RankingCompetition />
		</div>
	);
};
