import { Col, message, Row } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { findCompetitionbyId, selectCompetitionItem, selectUserInfo } from '../../../../../modules';
import { CompetitionInfo, PrizeTable, RankingTable } from '../../containers';
import './TradingCompetitionDetailMobileScreen.css';

// axios
import pluginAPI from '../../../api/index';

export interface Prize {
	rank: string;
	award: string;
}

export interface Prizes {
	competition_id: number | string;
	prizes: Prize[];
}

const prizeList: Prizes[] = [
	{
		competition_id: 1,
		prizes: [
			{
				rank: '1',
				award: '150,000 CX',
			},
			{
				rank: '2',
				award: '100,000 CX',
			},
			{
				rank: '3',
				award: '40,000 CX',
			},
			{
				rank: '4',
				award: '20,000 CX',
			},
			{
				rank: '5',
				award: '20,000 CX',
			},
			{
				rank: '6',
				award: '20,000 CX',
			},
			{
				rank: '7',
				award: '20,000 CX',
			},
			{
				rank: '8',
				award: '20,000 CX',
			},
			{
				rank: '9',
				award: '20,000 CX',
			},
			{
				rank: '10',
				award: '20,000 CX',
			},
			{
				rank: '11',
				award: '10,000 CX',
			},
			{
				rank: '12',
				award: '10,000 CX',
			},
			{
				rank: '13',
				award: '10,000 CX',
			},
			{
				rank: '14',
				award: '10,000 CX',
			},
			{
				rank: '15',
				award: '10,000 CX',
			},
			{
				rank: '16',
				award: '10,000 CX',
			},
			{
				rank: '17',
				award: '10,000 CX',
			},
			{
				rank: '18',
				award: '10,000 CX',
			},
			{
				rank: '19',
				award: '10,000 CX',
			},
			{
				rank: '20',
				award: '10,000 CX',
			},
		],
	},
	{
		competition_id: 2,
		prizes: [
			{
				rank: '1',
				award: '500$ in Ecoin',
			},
			{
				rank: '2',
				award: '250$ in Ecoin',
			},
			{
				rank: '3',
				award: '100$ in Ecoin',
			},
			{
				rank: '4',
				award: '50$ in Ecoin',
			},
			{
				rank: '5',
				award: '50$ in Ecoin',
			},
			{
				rank: '6',
				award: '50$ in Ecoin',
			},
		],
	},
];

export const TradingCompetitionDetailMobileScreen: React.FC = () => {
	const [rankOfUserState, setRankOfUserState] = React.useState(-1);
	const [volumnOfUserState, setVolumnOfUserState] = React.useState(0);

	const { competition_id } = useParams<{ competition_id: string }>();
	const competition = useSelector(selectCompetitionItem);
	const user = useSelector(selectUserInfo);

	const dispatch = useDispatch();
	const dispatchFetchCompetitionItemByID = ieoID =>
		dispatch(
			findCompetitionbyId({
				id: ieoID,
			}),
		);

	React.useEffect(() => {
		if (competition.loading) {
			message.loading('Waiting a seconds...', 0);
		} else {
			message.destroy();
		}

		return () => {
			message.destroy();
		};
	}, [competition.loading]);

	React.useEffect(() => {
		dispatchFetchCompetitionItemByID(competition_id);
	}, []);

	React.useEffect(() => {
		if (user.uid !== '') {
			pluginAPI
				.get(`/ranks/fetchByUid/competition_id=${competition_id}&uid=${user.uid}`)
				.then(res => {
					const data = res.data;
					if (data.payload.rank) {
						setRankOfUserState(data.payload.rank);
						setVolumnOfUserState(Number(data.payload.volumn));
					}
				})
				// tslint:disable-next-line: no-empty
				.catch(err => {});
		}
	}, [user.uid]);

	const prizeOfCompetition = prizeList.find(prize => `${prize.competition_id}` === competition_id);

	const renderTradingInfo = () => {
		if (prizeOfCompetition) {
			return (
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<CompetitionInfo volumn={volumnOfUserState} />
					</Col>
					<Col span={24}>
						<PrizeTable prizes={[...prizeOfCompetition.prizes]} />
					</Col>
				</Row>
			);
		}

		return (
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<CompetitionInfo volumn={volumnOfUserState} />
				</Col>
			</Row>
		);
	};

	return (
		<div id="trading-competition-detail-mobile-moible-screen">
			<div id="trading-competition-detail-mobile__info" className="container-fluid">
				{renderTradingInfo()}
			</div>
			<div id="trading-competition-detail-mobile__ranks" className="container-fluid">
				<RankingTable competition_id={competition_id} rank={rankOfUserState} prizes={prizeOfCompetition} />
			</div>
		</div>
	);
};
