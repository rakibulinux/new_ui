import { Table } from 'antd';
import format from 'date-fns/format';
import * as React from 'react';
import api from '../../api';

interface BuyersHistoryProps {
	ieoID: number;
}

interface BuyersHistoryModel {
	id: number;
	uid: string;
	quantity: string;
	base_currency: string;
	total: string;
	quote_currency: string;
	created_at: string;
}

export const BuyersHistory: React.FC<BuyersHistoryProps> = (props: BuyersHistoryProps) => {
	const columns = [
		{
			title: 'Uid',
			dataIndex: 'uid',
			key: 'uid',
		},
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
	];

	const [tableState, setTableState] = React.useState({
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
				`/ieo/fetch/buyers/ieo_id=${props.ieoID}&page=${params.pagination.current - 1}&size=${
					params.pagination.pageSize
				}`,
			)
				.then(response => {
					const data: any = [...response.data.payload];
					const newData = data.map((buyer: BuyersHistoryModel) => {
						const newdata = {
							...buyer,
							key: buyer.id,
							base_currency: buyer.base_currency.toUpperCase(),
							quote_currency: buyer.quote_currency.toUpperCase(),
							quantity: Number(buyer.quantity).toFixed(4),
							total: Number(buyer.total).toFixed(4),
							created_at: format(new Date(buyer.created_at), 'HH:mm:ss dd/MM/yyyy'),
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
		[props.ieoID, tableState],
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
			<h5 className="text-center text-info">All Purchase Transaction</h5>
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
