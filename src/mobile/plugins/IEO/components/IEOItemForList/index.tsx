import { currenciesFetch, selectCurrencies } from 'modules';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface IEOItemProps {
	id: String;
	type: 'ended' | 'ongoing' | 'upcoming';
	currencyId: string;
	startDate: string;
	endDate: string;
	description?: string;
	currencyAvailable: string[];
	bonus?: string;
	remains: number;
	total: number;
	progress: number;
}
export const IEOItemComponent: React.FC<IEOItemProps> = props => {
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	const history = useHistory();

	const status = (color: string, type: string) => {
		return (
			<div className="td-cpn-mobile-ieo-item__status" style={{ backgroundColor: `${color}` }}>
				<p style={{ textTransform: 'uppercase', fontSize: '14px', lineHeight: '16px', margin: 0 }}>{type}</p>
			</div>
		);
	};
	const renderStatus = (type: 'ended' | 'ongoing' | 'upcoming') => {
		switch (type) {
			case 'ongoing':
				return status(`#2FB67E`, 'Running');
			case 'upcoming':
				return status(` #E06211`, `Upcoming`);
			case 'ended':
				return status(`#BD3421`, 'Ended');
			default:
				return `#ffff`;
		}
	};
	const currencies = useSelector(selectCurrencies);
	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	const getCryptoIcon = (currencyID: string): string => {
		const currency = currencies.find((cur: any) => cur.id === currencyID.toLowerCase());
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return `<svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" fill="#efb914" fill-rule="nonzero" r="16"/><path d="M21.002 9.855A7.947 7.947 0 0124 15.278l-2.847-.708a5.357 5.357 0 00-3.86-3.667c-2.866-.713-5.76.991-6.465 3.806s1.05 5.675 3.917 6.388a5.373 5.373 0 005.134-1.43l2.847.707a7.974 7.974 0 01-5.2 3.385L16.716 27l-2.596-.645.644-2.575a8.28 8.28 0 01-1.298-.323l-.643 2.575-2.596-.646.81-3.241c-2.378-1.875-3.575-4.996-2.804-8.081s3.297-5.281 6.28-5.823L15.323 5l2.596.645-.644 2.575a8.28 8.28 0 011.298.323l.643-2.575 2.596.646z" fill="#fff"/></g></svg>`;
		}
	};

	return (
		<div
			className="td-cpn-mobile-ieo-item"
			onClick={() => {
				const location = {
					pathname: `/ieo/detail/${props.id}`,
				};
				history.push(location);
			}}
		>
			{renderStatus(props.type)}
			<div className="td-cpn-mobile-ieo-item__left">
				<img
					src={getCryptoIcon(props.currencyId.toUpperCase())}
					alt={`${props.currencyId}-icon`}
					style={{ width: '57.87px', height: '57.87px' }}
				/>
			</div>
			<div className="td-cpn-mobile-ieo-item__right">
				<h6 className="td-cpn-mobile-ieo-item__title">{props.description}</h6>
				<div className="td-cpn-mobile-ieo-item__list-tag">
					{props.currencyAvailable.map((currency, index) => (
						<span key={index}>{currency}</span>
					))}
				</div>
				<div className="td-cpn-mobile-ieo-item__desc">
					<span>{`Bonus ${!props.bonus ? '0%' : props.bonus}`}</span>
				</div>
			</div>
		</div>
	);
};
