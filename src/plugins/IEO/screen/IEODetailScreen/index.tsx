import * as React from 'react';
import { message } from 'antd';
import { IEODetail, BuyIEO } from './../../containers';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { findSalebyId, selectSaleItem, selectUserInfo } from '../../../../modules';

export const IEODetailScreen = () => {
	const history = useHistory();
	const { ieoID } = useParams<{ ieoID: string }>();
	const IEOItem = useSelector(selectSaleItem);
	const user = useSelector(selectUserInfo);
	const dispatch = useDispatch();
	const dispatchFetchSaleItemByID = (ieoIdParam: string) =>
		dispatch(
			findSalebyId({
				id: ieoIdParam,
			}),
		);
	React.useEffect(() => {
		if (IEOItem.loading) {
			message.loading('Waiting a seconds...', 0);
		} else {
			message.destroy();
		}
		return () => {
			message.destroy();
		};
	}, [IEOItem.loading]);
	React.useEffect(() => {
		dispatchFetchSaleItemByID(ieoID);
	}, []);
	return (
		<div id="ieo-detail-screen">
			<h3 className="ieo-title">IEO</h3>
			<button
				id="ioe-detail-screen__return-list"
				onClick={() => {
					history.goBack();
				}}
			>
				Return to List
			</button>
			{IEOItem.loading ? (
				<></>
			) : (
				<div id="ieo-detail-screen_container" className="d-flex flex-wrap justify-content-center">
					<div className="col-md-5">
						<IEODetail
							endDate={IEOItem.payload.end_date}
							startDate={IEOItem.payload.start_date}
							bonus={IEOItem.payload.bonus}
							currencyID={IEOItem.payload.currency_id}
						/>
					</div>

					<div className="col-md-5" style={{ backgroundColor: '#434A56' }}>
						<BuyIEO
							coins={IEOItem.payload.currency_available.length ? IEOItem.payload.currency_available : ['']}
							currencyID={IEOItem.payload.currency_id}
							priceIEO={Number(IEOItem.payload.price)}
							type={IEOItem.payload.type}
							minBuy={IEOItem.payload.min_buy}
							uid={user.uid}
							id={ieoID}
							bonus={IEOItem.payload.bonus}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
