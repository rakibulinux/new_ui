import { Table } from 'antd';
import * as React from 'react';

//css
import './RankingTable.css';

// image
import GoldCup from '../../assets/1st-v2.png';

import RankOne from '../../assets/1.png';
import RankTwo from '../../assets/2.png';
import RankThird from '../../assets/3.png';

import { useDispatch, useSelector } from 'react-redux';
import { selectTradingRankings, tradingRankingsFetch } from '../../../../modules';
import { Prizes } from '../../screens';

interface RankingTableProps {
	competition_id: number | string;
	rank: number;
	prizes: Prizes | undefined;
}

export const RankingTable: React.FC<RankingTableProps> = (props: RankingTableProps) => {
	const { competition_id, rank, prizes } = props;

	const dispatch = useDispatch();
	const dispatchFetchRanksByCompetitionID = (competitionId: number | string) =>
		dispatch(tradingRankingsFetch({ competition_id: competitionId }));

	React.useEffect(() => {
		dispatchFetchRanksByCompetitionID(competition_id);
	}, []);

	const ranks = useSelector(selectTradingRankings);

	const columns = [
		{
			title: 'Ranking',
			dataIndex: 'rank',
			key: 'rank',
			render: (rankParam: number) => {
				if (rankParam === 1) {
					return <img className="trading-rank__icon" src={RankOne} alt="rank 1" />;
				}
				if (rankParam === 2) {
					return <img className="trading-rank__icon" src={RankTwo} alt="rank 2" />;
				}
				if (rankParam === 3) {
					return <img className="trading-rank__icon" src={RankThird} alt="rank 3" />;
				}

				return rankParam;
			},
		},
		{
			title: 'UID',
			dataIndex: 'uid',
			key: 'uid',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Volume',
			dataIndex: 'volumn',
			key: 'volumn',
		},
		{
			title: 'Award',
			dataIndex: 'award',
			key: 'award',
		},
	];

	const data = ranks.payload.map(rankParam => {
		const newRank = {
			rank: rankParam.rank,
			uid: rankParam.uid,
			email: rankParam.email,
			volumn: Number(rankParam.volumn).toFixed(3),
		};

		return newRank;
	});

	const rankWithAward = data.map((n, index) => {
		const x = {
			...n,
			award: prizes && prizes.prizes[index] ? prizes.prizes[index].award : '',
		};

		return x;
	});

	return (
		<div id="trading-competition-ranking">
			<div className="row">
				<div className="col-12 d-flex flex-column align-items-center justify-content-center">
					<img style={{ width: '150px' }} src={GoldCup} alt="winner-cup" />
					<h3 className="mt-3" style={{ color: '#FFC48Eff', fontWeight: 'bold' }}>
						{data[0] ? data[0].uid : 'Winner'}
					</h3>
				</div>
			</div>

			<div className="row">
				<div className="col-6">
					<h3 style={{ textAlign: 'start' }}>🏆 Top 20 Rankings</h3>
				</div>
				<div className="col-6">{rank !== -1 ? <h3 style={{ textAlign: 'end' }}>Your rank: {rank}</h3> : ''}</div>
			</div>
			<div className="row">
				<div className="col-12">
					<Table size="small" pagination={false} dataSource={rankWithAward} columns={columns} />
				</div>
			</div>
		</div>
	);
};
