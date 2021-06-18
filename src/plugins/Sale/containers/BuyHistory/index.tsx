import { Table } from 'antd';
import format from 'date-fns/format';
import * as React from 'react';
import api from '../../../api';

interface BuyHistoryProps {
	uid: string;
	ieoID: number;
}

interface BuyHistoryModel {
	id: number;
	uid: string;
	quantity: string;
	base_currency: string;
	total: string;
	quote_currency: string;
	created_at: string;
}

export const BuyHistory: React.FC<BuyHistoryProps> = (props: BuyHistoryProps) => {
	const columns = [
		{
			title: 'Quantity',
			dataIndex: 'quantity',
			key: 'quantity',
		},
		{
			title: 'Currency',
			dataIndex: 'base_currency',
			key: 'base_currency',
		},
		{
			title: 'Total Purchase',
			dataIndex: 'total',
			key: 'total',
		},
		{
			title: 'Purchase Currency',
			dataIndex: 'quote_currency',
			key: 'quote_currency',
		},
		{
			title: 'Buy Date',
			dataIndex: 'created_at',
			key: 'created_at',
		},
	];

	const [tableState, setTableState] = React.useState<{
		data: BuyHistoryModel[];
		pagination: {
			current: number;
			pageSize: number;
			total: number;
		};
		loading: boolean;
	}>({
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		loading: false,
	});

	const fetch = React.useCallback(
		(params: any) => {
			setTableState({ ...tableState, loading: true });
			api.get(
				`/ieo/fetch/buy/uid=${props.uid}/ieo_id=${props.ieoID}&page=${params.pagination.current - 1}&size=${
					params.pagination.pageSize
				}`,
			)
				.then(response => {
					const data = [...response.data.payload] as BuyHistoryModel[];
					const newData = data.map((buy: BuyHistoryModel) => {
						const newdata = {
							...buy,
							key: buy.id,
							base_currency: buy.base_currency.toUpperCase(),
							quote_currency: buy.quote_currency.toUpperCase(),
							quantity: Number(buy.quantity).toFixed(4),
							total: Number(buy.total).toFixed(4),
							created_at: format(new Date(buy.created_at), 'HH:mm:ss dd/MM/yyyy'),
						};

						return newdata;
					});

					setTableState({
						loading: false,
						data: newData,
						pagination: {
							...params.pagination,
							pageSize: params.pagination.pageSize,
							total: response.data.total,
						},
					});
				})
				.catch(err => {
					//console.log(err);
				});
		},
		[props.ieoID, props.uid, tableState],
	);

	const handleTableChange = (pagination: any) => {
		fetch({
			pagination,
		});
	};

	React.useEffect(() => {
		const { pagination } = tableState;
		fetch({ pagination });
	}, []);

	return (
		<React.Fragment>
			<h2 className="text-center text-info">Your Purchase</h2>
			<Table
				size="small"
				pagination={tableState.pagination}
				dataSource={tableState.data}
				loading={tableState.loading}
				columns={columns}
				onChange={handleTableChange}
			/>
		</React.Fragment>
	);
};
