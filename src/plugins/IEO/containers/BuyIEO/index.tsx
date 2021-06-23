import * as React from 'react';
import classNames from 'classnames';
import iconCoin from './assets/lK.png';
interface BuyIEOProps {
	coins: Array<String>;
}

const percents = ['25%', '50%', '75%', '100%'];
export const BuyIEO: React.FC<BuyIEOProps> = props => {
	const activeBuyCoinClassNames = classNames('buy-ieo-coin', 'active');
	const non_activeClassNames = classNames('buy-ieo-coin', 'non_active');
	const [coinActive, setCoinActive] = React.useState(0);
	const [percentActive, setPercentActive] = React.useState(0);

	const activePercentClassNames = classNames('percent_active');
	const non_ActivePercentClassNames = classNames('percent_non_active');

	return (
		<div id="buy-ieo">
			<div id="buy-ieo-container" className="col-md-12">
				<div id="buy-ieo-coins">
					{props.coins.map((coin, index) => (
						<button
							className={coinActive === index ? activeBuyCoinClassNames : non_activeClassNames}
							onClick={() => {
								setCoinActive(index);
							}}
						>
							{coin}
						</button>
					))}
				</div>
				<div id="buy-ieo-body" className="d-flex flex-wrap justify-content-center">
					<div className="col-12 d-flex justify-content-between" style={{ padding: '0' }}>
						<div id="buy-ieo-body-bonus" className="col-md-6">
							<p className="ml-4">Bonus 2%</p>
						</div>

						<div id="buy-ieo-body-available" className="col-md-6" style={{ paddingRight: '20' }}>
							<p className="buy-ieo-type">Buy PROB</p>
							<p className="buy-ieo-available-amount">
								Available Amount <span>0.00000000</span> PROB
							</p>
						</div>
					</div>

					<div id="buy-ieo-body-payment" style={{ padding: '0' }} className="d-flex flex-wrap">
						<div id="buy-ieo-body-payment-coin-avt">
							<img src={iconCoin} alt="iconCoin"></img>
						</div>
						<input type="number" id="buy-ieo-body-payment-input" placeholder="0"></input>
						<span id="denominations-coin">PROB</span>
					</div>

					<div id="buy-ieo-body-payment-percents" className="row d-flex justify-content-center">
						{percents.map((percent, index) => (
							<button
								type="button"
								className={`col-3  ${
									index === percentActive ? activePercentClassNames : non_ActivePercentClassNames
								}`}
								onClick={event => {
									event.preventDefault();
									setPercentActive(index);
								}}
							>
								{percent}
							</button>
						))}
					</div>

					<div id="buy-ieo-body-customer-get" className="d-flex justify-content-between">
						<p>you get</p>
						<p className="coin-convention">
							<span>0</span> ONI
						</p>
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
						Buy CX
					</button>
				</div>
			</div>
			<div className="buy-ieo-notes">
				<ul className="buy-ieo-note">
					<li>Estimated Value</li>
					<li className="value">0 USDT</li>
				</ul>
				<ul className="buy-ieo-note">
					<li>Estimated Value</li>
					<li className="value">0 USDT</li>
				</ul>
				<ul className="buy-ieo-note">
					<li>Estimated Value</li>
					<li className="value">0 USDT</li>
				</ul>
				<ul className="buy-ieo-note">
					<li>Estimated Value</li>
					<li className="value">0 USDT</li>
				</ul>
			</div>
		</div>
	);
};
