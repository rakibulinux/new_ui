import * as React from 'react';
import { message } from 'antd';
import { IEODetail, BuyIEO } from './../../containers';
import { useHistory } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { findSalebyId, selectSaleItem } from '../../../../modules';

export const IEODetailScreen = () => {
	const history = useHistory();
	const { ieoID } = useParams<{ ieoID: string }>();
	const IEOItem = useSelector(selectSaleItem);
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
				Return to Lists
			</button>
			<div id="ieo-detail-screen_container" className="d-flex justify-content-center">
				<div className="col-5" style={{ height: '591px' }}>
					<IEODetail
						imageLink={IEOItem.payload.image_link || ''}
						endDate={IEOItem.payload.end_date || ''}
						startDate={IEOItem.payload.start_date || ''}
						bonus={IEOItem.payload.bonus || 'loading'}
						currencyID={IEOItem.payload.currency_id || 'loading'}
					/>
				</div>
				<div className="col-5" style={{ backgroundColor: '#434A56', height: '591px' }}>
					<BuyIEO
						coins={IEOItem.payload.currency_available || ''}
						currencyID={IEOItem.payload.currency_id || 'loading'}
						bonus={IEOItem.payload.bonus || 'loading'}
					/>
				</div>
			</div>
		</div>
	);
};
