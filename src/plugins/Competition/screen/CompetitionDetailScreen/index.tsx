import { toNumber } from 'lodash';
import { fetchCompetitionItem, fetchCompetitionVolume, selectVolumeCompetition } from 'modules';
import { selectItemCompetition } from 'modules/plugins/competition/item/selectors';
import { LoadingCompetition, TableAwards } from 'plugins/Competition/components';
import { CompetitionInfo } from 'plugins/Competition/containers';
import { RankingCompetition } from 'plugins/Competition/containers/RankingCompetition';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const CompetitionDetailScreen = () => {
	const { competition_id } = useParams<{ competition_id: string }>();
	const dispatch = useDispatch();
	const ranking = useSelector(selectVolumeCompetition);
	const competition = useSelector(selectItemCompetition);

	const { currency_id, start_date, end_date, type, market_ids, next_update } = competition.payload;

	React.useEffect(() => {
		dispatch(fetchCompetitionItem(toNumber(competition_id)));
		dispatch(fetchCompetitionVolume(type, toNumber(competition_id)));
	}, []);

	return (
		<div id="competition-ranking-screen" className="container">
			{competition.loading && ranking.loading ? (
				<LoadingCompetition />
			) : (
				<CompetitionInfo
					currency_id={currency_id}
					start_date={start_date}
					end_date={end_date}
					type={type}
					markets={market_ids.split(',')}
					volume={ranking.payload.volume}
					next_update={next_update}
				/>
			)}

			<div className="competition-ranking-awards row mt-5 d-flex justify-content-center">
				<div className="col-md-6 col-sm-12">
					<TableAwards awards={[]} />
				</div>
			</div>
			<RankingCompetition />
		</div>
	);
};
