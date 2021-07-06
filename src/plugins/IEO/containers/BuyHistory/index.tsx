import format from 'date-fns/format';
import * as React from 'react';
import api from '../../../api';
import classnames from 'classnames';
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
	const [numberPage, setNumberPage] = React.useState<number>(1);
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
	
	const EmptyComponent = () => {
		return (
			<div className="col-12 d-flex justify-content-center mb-3">
				<img
					src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
					style={{ marginTop: '3rem' }}
					alt="empty"
				/>
			</div>
		);
	};
	const fetch = (params: any) => {
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
	};

	const handleTableChange = (pagination: any) => {
		fetch({
			pagination,
		});
	};
	const disabledForwardClass = classnames('disable-forward');
	const renderPagination = () => {
		return (
			<nav aria-label="Page navigation" >
				<ul className="pagination" style ={{justifyContent: "flex-end"}}>
					<li className="page-item">
						<a
							className={`page-link ${numberPage === 1 ? disabledForwardClass : ''}`}
							aria-label="Previous"
							onClick={() => {
								if (numberPage > 1) {
									handleTableChange(numberPage - 1);
									setNumberPage(numberPage - 1);
								}
							}}
						>
							<span aria-hidden="true">«</span>
							<span className="sr-only">Previous</span>
						</a>
					</li>
					<li className="page-item">
						<a className="page-link">{numberPage}</a>
					</li>

					<li className="page-item">
						<a
							className={`page-link ${
								numberPage * tableState.pagination.pageSize >= tableState.data.length ? disabledForwardClass : ''
							}`}
							aria-label="Next"
							onClick={() => {
								if (numberPage * tableState.pagination.pageSize < tableState.data.length) {
									handleTableChange(numberPage + 1);
									setNumberPage(numberPage + 1);
								}
							}}
						>
							<span aria-hidden="true">»</span>
							<span className="sr-only">Next</span>
						</a>
					</li>
				</ul>
			</nav>
		);
	};
	React.useEffect(() => {
		const { pagination } = tableState;
		fetch({ pagination });
	}, []);

	return (
		<React.Fragment>
			<div id="buy-history">
				<h2 className="text-center text-white">Your Purchase</h2>
				<div className="table-responsive-xl mb-4">
					<table className="table">
						<thead
							style={{
								background: 'rgba(0, 0, 0, 0.08)',
								borderRadius: '3px',
								boxSizing: 'border-box',
								color: '#ffff',
							}}
						>
							<tr className="text-center">
								<th>Uid</th>
								<th>Quantity</th>
								<th>Currency</th>
								<th>Total Purchase</th>
								<th>Purchase Currency</th>
								<th>Buy Date</th>
							</tr>
							<tr></tr>
						</thead>
						<tbody>
							{tableState.data.map(item => {
								return (
									<>
										<tr className="text-center" style={{ color: '#ffff', border: '1px solid #848e9' }}>
											<td>{item.quantity}</td>
											<td>{item.base_currency}</td>
											<td>{item.total}</td>
											<td>{item.quote_currency}</td>
											<td>{item.created_at}</td>
										</tr>
									</>
								);
							})}
						</tbody>
					</table>
					{!tableState.data.length ? EmptyComponent() : <></>}
				</div>

				{renderPagination()}
			</div>
		</React.Fragment>
	);
};
