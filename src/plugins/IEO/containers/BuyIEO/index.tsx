import * as React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { currenciesFetch, selectCurrencies } from '../../../../modules';

interface BuyIEOProps {
	coins: Array<String>;
	currencyID: string;
	priceIEO: number | undefined;
	type: string | undefined;
	minBuy: number | undefined;
	uid: string;
}

export const BuyIEO: React.FC<BuyIEOProps> = props => {
	const [selectedCurrencyState, setSelectedCurrencyState] = React.useState(props.coins[0] || '');
	const [coinActive, setCoinActive] = React.useState(0);
	const currencies = useSelector(selectCurrencies);
	React.useEffect(() => {
		setSelectedCurrencyState(props.coins[0]);
	}, [props.coins[0]]);

	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};


	const non_activeClassNames = classNames('buy-ieo-coin', 'non_active');
	const activeBuyCoinClassNames = classNames('buy-ieo-coin', 'active');

	return (
		<div id="buy-ieo">
			<div id="buy-ieo-container" className="col-md-12">
				<div id="buy-ieo-coins">
					{props.coins.map((coin, index) => (
						<button
							className={coinActive === index ? activeBuyCoinClassNames : non_activeClassNames}
							onClick={() => {
								setCoinActive(index);
								setSelectedCurrencyState(coin.toString());
							}}
						>
							{coin}
						</button>
					))}
				</div>
				<div id="buy-ieo-body" className="d-flex flex-wrap">
					<div className="col-12 d-flex justify-content-between" style={{ padding: '0' }}>
						<div id="buy-ieo-body-available" style={{ textAlign: 'right', width: '100%' }}>
							<p className="buy-ieo-available-amount">
								Available Amount <span>0.00000000</span> {`${props.currencyID.toUpperCase()}`}
							</p>
						</div>
					</div>

					<div id="buy-ieo-body-payment" style={{ padding: '0' }} className="d-flex flex-wrap input-group-body mt-5">
						<div id="buy-ieo-body-coin-avt">
							<img src={findIcon(props.currencyID)} alt="iconCoin"></img>
						</div>
						<input type="number" id="buy-ieo-body-input" placeholder="0"></input>
						<span id="denominations-coin">{props.currencyID}</span>
					</div>

					<div id="buy-ieo-body-price" style={{ padding: '0' }} className="d-flex flex-wrap input-group-body mt-5">
						<div id="buy-ieo-body-coin-avt">
							<img src={findIcon(selectedCurrencyState.toString())} alt="iconCoin"></img>
						</div>
						<input
							type="number"
							id="buy-ieo-body-input"
							placeholder="0"
							style={{ background: 'rgb(61 55 81 / 40%)', borderRight: '1px solid #848e9c', cursor: 'not-allowed' }}
							disabled
						></input>
						<span id="denominations-coin">{selectedCurrencyState.toString()}</span>
					</div>

					<div id="buy-ieo-body-total" style={{ padding: '0' }} className="d-flex flex-wrap input-group-body mt-5">
						<div id="buy-ieo-body-coin-avt">
							<img src={findIcon(selectedCurrencyState.toString())} alt="iconCoin"></img>
						</div>
						<input
							type="number"
							id="buy-ieo-body-input"
							style={{ background: 'rgb(61 55 81 / 40%)', borderRight: '1px solid #848e9c', cursor: 'not-allowed' }}
							placeholder="0"
							disabled
						></input>
						<span id="denominations-coin">{selectedCurrencyState.toString()}</span>
					</div>

					<div id="regulations">
						<div className="input-group d-flex">
							<input
								type="checkbox"
								name="regulations-view-items"
								id="regulations-view-items"
								className="regulations-law"
							></input>
							<label htmlFor="regulations-view-items" className="ml-2">
								I agree with the token purchasing terms .
								<a style={{ textDecoration: 'underline', cursor: 'pointer' }}>View Terms</a>
							</label>
						</div>
						<div className="input-group d-flex">
							<input type="checkbox" className="regulations-law" name="check-citizen-ban"></input>
							<label htmlFor="check-citizen-ban" className="ml-2">
								I'm not a citizen of one of the countries that bans ICO trading.
							</label>
						</div>
					</div>

					<button type="button" className="btn-buy-ieo btn">
						{`Buy ${props.currencyID}`}
					</button>
				</div>
			</div>
		</div>
	);
};
