import * as React from 'react';

import { Button, Menu, message, Progress, Table } from 'antd';
import Countdown from 'react-countdown';
import { useHistory } from 'react-router';
import axios from '../../../api/index';

import { Airdrop } from '../../../../modules';
import './AirdropTable.css';

const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		// render a completed state
		// window.location.reload(false);
		return <span>Timeout</span>;
	} else {
		// render a countdown
		return (
			<span>
				{days ? days : 0} days | {hours}:{minutes}:{seconds}
			</span>
		);
	}
};

export const AirdropTable: React.FunctionComponent = () => {
	const history = useHistory();
	const [tableState, setTableState] = React.useState({
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		loading: false,
	});
	const [keyState, setKeyState] = React.useState('open');

	React.useEffect(() => {
		// tslint:disable-next-line: no-floating-promises
		axios
			.get(`airdrop/fetch/opening/page=${tableState.pagination.current - 1}&size=${tableState.pagination.pageSize}`)
			.then(airdrops => {
				handleAirdropList(tableState, airdrops.data);
			});
	}, []);

	const handleAirdropList = (params, airdrops) => {
		setTableState({
			data: airdrops.payload,
			loading: false,
			pagination: {
				...params.pagination,
				pageSize: params.pagination.pageSize,
				total: airdrops.total,
			},
		});
	};

	const fetch = (params: any) => {
		setTableState({ ...tableState, loading: true });
		try {
			switch (params.key) {
				case 'wait':
					// tslint:disable-next-line: no-floating-promises
					axios
						.get(`airdrop/fetch/waiting/page=${params.pagination.current - 1}&size=${params.pagination.pageSize}`)
						.then(airdrops => handleAirdropList(params, airdrops.data));
					break;
				case 'open':
					// tslint:disable-next-line: no-floating-promises
					axios
						.get(`airdrop/fetch/opening/page=${params.pagination.current - 1}&size=${params.pagination.pageSize}`)
						.then(airdrops => handleAirdropList(params, airdrops.data));
					break;
				case 'delivering':
					// tslint:disable-next-line: no-floating-promises
					axios
						.get(`airdrop/fetch/delivering/page=${params.pagination.current - 1}&size=${params.pagination.pageSize}`)
						.then(airdrops => handleAirdropList(params, airdrops.data));
					break;
				case 'delivered':
					// tslint:disable-next-line: no-floating-promises
					axios
						.get(`airdrop/fetch/delivered/page=${params.pagination.current - 1}&size=${params.pagination.pageSize}`)
						.then(airdrops => handleAirdropList(params, airdrops.data));
					break;
				default:
					break;
			}
		} catch (error) {
			message.error('Sorry. Maybe have issues. We will fix it soon.');
		}
	};

	const handleSelectMenuItem = ({ key, domEvent }) => {
		setKeyState(key);
		const { pagination } = tableState;
		fetch({ pagination, key: key });
	};

	const handleTableChange = pagination => {
		fetch({
			pagination,
			key: keyState,
		});
	};

	const dataSource = tableState.data.map((airdrop: Airdrop) => {
		const date =
			keyState === 'wait'
				? airdrop.start_date
				: keyState === 'open'
				? airdrop.end_date
				: keyState === 'delivering'
				? airdrop.deliver_date
				: '';
		const remainTime = keyState === 'delivered' ? 'Ended' : <Countdown date={new Date(date)} renderer={renderer} />;
		const goAirdropDetailHandler = () => {
			if (!(keyState === 'waiting' || keyState === 'delivered')) {
				const location = {
					pathname: `/airdrop/detail/${airdrop.airdrop_id}`,
					state: { fromDashboard: true },
				};
				history.push(location);
			}
		};

		const newAirdrop = {
			key: airdrop.airdrop_id,
			airdrop_name: airdrop.airdrop_name,
			earned_token: `${airdrop.tokens_per_claim} ${airdrop.token_name}`,
			remain_tokens: (
				<div>
					<span>{(airdrop.total_tokens - airdrop.remain_tokens) / airdrop.tokens_per_claim} Participant</span>
					<span>
						{' '}
						|| Remain: {airdrop.remain_tokens} {airdrop.token_name}
					</span>
					<Progress
						strokeColor={{
							from: '#108ee9',
							to: '#87d068',
						}}
						showInfo={false}
						percent={100 - (airdrop.remain_tokens / airdrop.total_tokens) * 100}
						status="active"
					/>
				</div>
			),
			timer_remain: remainTime,
			action: (
				<Button
					onClick={goAirdropDetailHandler}
					type="primary"
					disabled={keyState === 'wait' || keyState === 'delivered'}
				>
					{keyState === 'delivering' ? 'View' : 'Join'}
				</Button>
			),
		};

		return newAirdrop;
	});

	const columns = [
		{
			title: 'Airdrop Name',
			dataIndex: 'airdrop_name',
			key: 'airdrop_name',
		},
		{
			title: 'Earned Tokens',
			dataIndex: 'earned_token',
			key: 'earned-token',
		},
		{
			title: 'Remain Tokens',
			dataIndex: 'remain_tokens',
			key: 'remain_tokens',
		},
		{
			title: 'Time Remain',
			dataIndex: 'timer_remain',
			key: 'timer_remain',
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
		},
	];

	return (
		<div className="container">
			<div className="row">
				<div className="col-12">
					<Menu mode="horizontal" defaultSelectedKeys={['open']} onClick={handleSelectMenuItem}>
						<Menu.Item key="open">
							<span style={{ color: '#4284F5ff' }}>Active</span>
						</Menu.Item>
						<Menu.Item key="wait">
							<span style={{ color: '#FABE08ff' }}>Up coming</span>
						</Menu.Item>
						<Menu.Item key="delivering">
							<span style={{ color: '#0C9D58ff' }}>Wait for distribute</span>
						</Menu.Item>
						<Menu.Item key="delivered">
							<span style={{ color: '#EA4235ff' }}>Ended</span>
						</Menu.Item>
					</Menu>
				</div>
			</div>
			<div className="row">
				<div className="col-12 airdrop-table-wrapper">
					<Table
						size="small"
						pagination={tableState.pagination}
						key="key"
						loading={tableState.loading}
						onChange={handleTableChange}
						dataSource={dataSource}
						columns={columns}
					/>
				</div>
			</div>
		</div>
	);
};
