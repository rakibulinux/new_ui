import { toNumber } from 'lodash';
import { fetchCompetitionItem, fetchCompetitionVolume, selectVolumeCompetition } from 'modules';
import { selectItemCompetition } from 'modules/plugins/competition';
import { CompetitionInfo, RankingCompetition, CompetitionAward } from 'plugins/Competition/containers';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const CompetitionDetailScreen = () => {
	const { competition_id } = useParams<{ competition_id: string }>();
	const dispatch = useDispatch();
	const userVolume = useSelector(selectVolumeCompetition);
	const competition = useSelector(selectItemCompetition);
	const { currency_id, start_date, end_date, type, market_ids, next_update, limit_display, status } = competition.payload;

	React.useEffect(() => {
		dispatch(fetchCompetitionItem(toNumber(competition_id)));
		dispatch(fetchCompetitionVolume(toNumber(competition_id)));
	}, []);
	const dispatchFetchCompetition = () => dispatch(fetchCompetitionItem(toNumber(competition_id)));

	return (
		<div id="competition-detail-screen" className="container-fluid">
			<CompetitionInfo
				loading={competition.loading || userVolume.loading}
				currency_id={currency_id}
				start_date={start_date}
				end_date={end_date}
				type={type}
				markets={market_ids.split(',')}
				volume={Number(userVolume.payload.volume)}
				next_update={next_update}
				status={status}
				dispatchFetchCompetition={dispatchFetchCompetition}
			/>
			<CompetitionAward competition_id={Number(competition_id)} />
			<RankingCompetition
				loading={competition.loading}
				limit_display={toNumber(limit_display)}
				competition_id={toNumber(competition_id)}
			/>
		</div>
	);
};
