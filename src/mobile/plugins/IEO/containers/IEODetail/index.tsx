import React from 'react';
import MaskGroup from './assets/MaskGroup.png';
import { useSelector, useDispatch } from 'react-redux';
import { currenciesFetch, selectCurrencies } from '../../../../../modules';

interface IEODetailProps {
	startDate: string;
	endDate: string;
	bonus: string;
	currencyID: string;
}

export const IEODetail: React.FC<IEODetailProps> = props => {
	const formatDate = date => {
		return new Date(date).toString().split(' ').slice(0, 5).join(' ');
	};
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	const currencies = useSelector(selectCurrencies);
	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	return (
		<div id="ieo-detail" style={{ backgroundImage: `url(${MaskGroup})` }}>
			<div className="content col-11 m-auto">
				<div id="ieo-detail-header"></div>
				<div id="ieo-detail-body" className="col-12">
					<div className="logo-icon d-flex justify-content-center">
						<img src={findIcon(props.currencyID)} alt={`${props.currencyID.toUpperCase()}-icon`}></img>
					</div>
					<p id="ieo-detail-body-time">{`${formatDate(props.startDate)} ~ ${formatDate(props.endDate)}`}</p>
				</div>
				<hr></hr>
				<div id="ieo-detail-footer">
					<p>{`${props.bonus ? props.bonus : 0}% Bonus ${props.currencyID.toUpperCase()}`}</p>
				</div>
			</div>
		</div>
	);
};
